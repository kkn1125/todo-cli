import { INPUT_NEXT_LINE, PER_PAGE } from "@common/variables";
import { checkbox, input, select, Separator } from "@inquirer/prompts";
import { Process, ProcessIcon } from "@module/enum/Process";
import TodoManager from "@module/TodoManager";
import { capitalize } from "./util/capitalize";

let page = 1;
let idOrFalse: string | false | undefined;
let controller = new AbortController();

process.stdin.on("keypress", (_, key) => {
  if (key.name === "escape") {
    controller.abort();
  }
});

async function stepMain() {
  const selected = await select({
    message: "메뉴를 선택하세요.",
    choices: [
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
        name: "할 일 수정",
        value: "modify",
        description: "할 일을 수정합니다.",
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
    ],
  });
  switch (selected) {
    case "list":
      await stepShowTodoList(page);
      break;
    case "create":
      await stepAddTodo();
      break;
    case "modify":
      await stepModifyTodo(page);
      break;
    case "save":
      await stepSaveRemoteRepository();
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
  const total = Math.ceil(todoList.length / pagePer);

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
    theme: { icon: { cursor: "📌" } },
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

async function stepModifyTodo(page: number) {
  controller = new AbortController();
  const manager = new TodoManager();
  const todoList = manager.findAll();
  const choiceTodoList = todoList.map((todo, i) => ({
    name: `${("" + (i + 1)).padStart(2, "0")}. ${
      ProcessIcon[capitalize(todo.process)]
    } ${todo.content}`,
    value: todo.id,
  }));
  const pagePer = PER_PAGE - 4;
  const total = Math.ceil(todoList.length / pagePer);

  try {
    const checked = await checkbox(
      {
        message: `등록된 할 일 목록 (${todoList.length}개) [${page}/${total}]`,
        choices: [...choiceTodoList],
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
        theme: { icon: { cursor: "📌" } },
      },
      { signal: controller.signal }
    );

    switch (selected) {
      case "완료":
        checked.forEach((check) => {
          manager.updateState(check, Process.Done);
        });
        stepModifyTodo(page);
        break;
      case "진행":
        checked.forEach((check) => {
          manager.updateState(check, Process.Doing);
        });
        stepModifyTodo(page);
        break;
      case "대기":
        checked.forEach((check) => {
          manager.updateState(check, Process.Init);
        });
        stepModifyTodo(page);
        break;
      case "돌아가기":
        stepShowTodoList(page);
        break;
    }
  } catch (error) {
    stepModifyTodo(page);
  }
}

async function stepSaveRemoteRepository() {
  const manager = new TodoManager();
  await manager.saveToRepository();
  console.log("✅ 원격저장소에 데이터를 저장하였습니다.");
  stepMain();
}

stepMain();
