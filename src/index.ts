import { INPUT_NEXT_LINE, PER_PAGE } from "@common/variables";
import { checkbox, confirm, input, select, Separator } from "@inquirer/prompts";
import { Process, ProcessIcon } from "@module/enum/Process";
import TodoManager from "@module/TodoManager";
import { capitalize } from "./util/capitalize";
import { diffRemoteDatabase } from "./util/diffRemoteDatabase";
import { getCurrentOS } from "./util/getCurrentOS";
import { installChoco } from "./util/installChoco";

let page = 1;
let idOrFalse: string | false | undefined;
let controller = new AbortController();
let warnInstallRequired = false;

process.stdin.on("keypress", (_, key) => {
  if (key.name === "escape") {
    controller.abort();
  }
});

async function stepMain() {
  const manager = new TodoManager();
  const platform = getCurrentOS();
  console.log('🔎 [알림] 감지된 OS는 "%s"입니다.', platform);
  const isInstalled = manager.isInstallGithubCli();
  if (!isInstalled) {
    warnInstallRequired = true;
    console.log(
      "🔥 [알림] Github CLI가 설치되어 있지 않습니다. 해당 프로그램은 gh명령을 통해 원격 저장소와 데이터를 동기화하기 때문에 필수사항입니다."
    );
    // it's message, when not logged in.
    // const message = "You are not logged into any GitHub hosts.";
  }

  const result = await diffRemoteDatabase(manager.data);

  if (result > 0) {
    console.log(
      "⚠️ 데이터베이스가 원격 저장소와 차이가 있습니다. 원격 저장소와 동기화합니다.\n"
    );
  }

  const choices: (
    | Separator
    | { name: string; value: string; description: string }
  )[] = [
    {
      name: "할 일 목록 보기",
      value: "list",
      description: "할 일 목록을 표시합니다.",
    },
    {
      name: "할 일 작성",
      value: "create",
      description: "할 일을 추가합니다.",
    },
    {
      name: "할 일 상태 수정",
      value: "modify",
      description: "할 일 상태를 수정합니다.",
    },
    {
      name: "원격 저장소 데이터 가져오기",
      value: "pull",
      description: "원격 저장소에 데이터를 가져와 덮어씁니다.",
    },
    {
      name: "원격 저장소 데이터 저장",
      value: "save",
      description: "원격 저장소에 데이터를 저장합니다.",
    },
    {
      name: "종료",
      value: "end",
      description: "프로그램을 종료합니다.",
    },
  ];

  if (warnInstallRequired) {
    choices.unshift(
      {
        name: "⚠️ Github CLI 설치하기",
        value: "installation-gh",
        description: "필수 항목인 Github CLI를 설치합니다.",
      },
      new Separator()
    );
  }

  const selected = await select({
    message: "메뉴를 선택하세요.",
    choices,
    pageSize: choices.length,
  });
  switch (selected) {
    case "list":
      page = 1;
      await stepShowTodoList(page);
      break;
    case "create":
      await stepAddTodo();
      break;
    case "modify":
      page = 1;
      await stepModifyTodo();
      break;
    case "pull":
      manager.pullRemoteDatabase();
      stepMain();
      break;
    case "installation-gh":
      const isInstalling = await confirm({ message: "설치하시겠습니까?" });
      if (isInstalling) {
        const selected = await manager.installGithubCli();
        if (!selected) {
          const selected = await select({
            message:
              "⚠️ GitHub CLI를 설치하려면 도구가 필요합니다. 도구를 설치하면 GitHub CLI가 자동으로 추가됩니다.",
            choices: [
              { name: "winget 설치", value: "winget" },
              { name: "chocolatey 설치", value: "choco" },
            ],
          });
          switch (selected) {
            case "choco":
              await installChoco();
              break;
          }
        } else {
          await installChoco();
        }
      }
      stepMain();
      break;
    case "save":
      const diffAmount = await diffRemoteDatabase(manager.data);
      if (diffAmount > 0) {
        const saveRemote = await confirm({
          message: `로컬에서 추가된 데이터가 ${diffAmount}개 있습니다. 원격 저장소에 추가하시겠습니까?`,
        });
        if (saveRemote) {
          await stepSaveRemoteRepository();
        } else {
          stepMain();
        }
      } else {
        console.log("✅ 로컬에서 추가된 데이터가 없습니다.");
        stepMain();
      }
      break;
    case "end":
      process.exit(0);
  }
}

async function stepAddTodo() {
  controller = new AbortController();
  try {
    const content = await input(
      {
        message: `할 일을 입력하세요.${INPUT_NEXT_LINE}`,
        required: true,
      },
      { signal: controller.signal }
    );
    const manager = new TodoManager();
    manager.add(content);
  } catch (error) {
    controller = new AbortController();
  }
  stepMain();
}

async function stepShowTodoList(page: number) {
  const manager = new TodoManager();
  const todoList = manager.findAll();
  const choiceTodoList = todoList.map((todo, i) => ({
    name: `${("" + (i + 1)).padStart(2, "0")}. ${
      ProcessIcon[capitalize(todo.process)]
    } ${todo.content}`,
    value: todo.id,
  }));
  const pagePer = PER_PAGE - 4;
  const total = Math.ceil(todoList.length / pagePer) || 1;

  const selected = await select({
    message: `등록된 할 일 목록 (${todoList.length}개) [${page}/${total}]`,
    choices: [
      ...choiceTodoList.slice((page - 1) * pagePer, page * pagePer),
      new Separator(),
      { name: "이전 페이지", value: "prev" },
      { name: "다음 페이지", value: "next" },
      { name: "돌아가기", value: "back" },
    ],
    pageSize: PER_PAGE,
  });

  switch (true) {
    case choiceTodoList.some((todo) => todo.value === selected):
      idOrFalse = selected;
      stepEditTodo(idOrFalse as string);
      break;
    case selected === "back":
      idOrFalse = false;
      stepMain();
      break;
    case selected === "prev":
      idOrFalse = false;
      page = page - 1 < 1 ? 1 : page - 1;
      stepShowTodoList(page);
      break;
    case selected === "next":
      idOrFalse = false;
      page = page + 1 > total ? total : page + 1;
      stepShowTodoList(page);
      break;
  }
}

async function stepEditTodo(id: string) {
  controller = new AbortController();
  const manager = new TodoManager();
  const todo = manager.findOne(id);

  if (!todo) return;

  try {
    const newContent = await input(
      {
        message: `Todo: ${todo.content}${INPUT_NEXT_LINE}`,
        required: true,
      },
      { signal: controller.signal }
    );
    manager.updateContent(id, newContent);
  } catch (error) {
    controller = new AbortController();
  } finally {
    stepMain();
  }
}

async function stepModifyTodo() {
  controller = new AbortController();
  const manager = new TodoManager();
  const todoList = manager.findAll();
  const choiceTodoList = todoList.map((todo, i) => ({
    name: `${("" + (i + 1)).padStart(2, "0")}. ${
      ProcessIcon[capitalize(todo.process)]
    } ${todo.content}`,
    value: todo.id,
  }));

  try {
    const checked = await checkbox(
      {
        message: `등록된 할 일 목록 (${todoList.length}개)`,
        choices: [...choiceTodoList, new Separator()],
        pageSize: PER_PAGE,
        theme: { icon: { cursor: "📌" } },
      },
      { signal: controller.signal }
    );

    const selected = await select(
      {
        message: `선택된 할 일 상태를 설정해주세요.`,
        choices: ["완료", "진행", "대기", new Separator(), "돌아가기"],
        pageSize: PER_PAGE,
      },
      { signal: controller.signal }
    );

    switch (selected) {
      case "완료":
        checked.forEach((check) => {
          manager.updateState(check, Process.Done);
        });
        stepModifyTodo();
        break;
      case "진행":
        checked.forEach((check) => {
          manager.updateState(check, Process.Doing);
        });
        stepModifyTodo();
        break;
      case "대기":
        checked.forEach((check) => {
          manager.updateState(check, Process.Init);
        });
        stepModifyTodo();
        break;
      case "돌아가기":
        stepModifyTodo();
        break;
    }
  } catch (error) {
    stepModifyTodo();
  }
}

async function stepSaveRemoteRepository() {
  const manager = new TodoManager();
  await manager.saveToRepository();
  console.log("✅ 원격저장소에 데이터를 저장하였습니다.");
  stepMain();
}

stepMain();
