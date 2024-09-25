import { input, select, checkbox } from "@inquirer/prompts";
import TodoManager from "@module/TodoManager";

async function main() {
  // const manager = new TodoManager();
  // manager.init();
  // manager.save();
  const nextStep = await stepMain();
  switch (nextStep) {
    case "list":
      await stepShowTodoList();
      break;
    case "create":
      await stepAddTodo();
      break;
  }
}

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
        name: "종료",
        value: "end",
        description: "프로그램을 종료합니다.",
      },
    ],
  });
  switch (selected) {
    case "list":
      return selected;
    case "create":
      return selected;
    case "end":
      process.exit(0);
  }
}

async function stepAddTodo() {
  const content = await input({
    message: "할 일을 입력하세요.",
    required: true,
  });
  const manager = new TodoManager();
  manager.add(content);
}

async function stepShowTodoList() {
  const manager = new TodoManager();
  manager.load();
  const todoList = manager.findAll();

  await select({
    message: "등록된 할 일 목록",
    choices: todoList.map((todo) => ({
      name: todo.content,
      value: todo.id,
    })),
  });
}

main();
