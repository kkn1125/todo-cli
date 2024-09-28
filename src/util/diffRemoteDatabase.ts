import { ACCOUNT, REPO_NAME } from "@common/variables";
import { ITodoList } from "@module/interface/ITodoList";
import { execSync } from "child_process";
import { counterSet } from "./counterSet";

export async function diffRemoteDatabase(currentData: ITodoList) {
  const origin = execSync(
    `gh api repos/${ACCOUNT}/${REPO_NAME}/contents/database/todo_list.json --jq .content | base64 --decode`
  );
  const originData = JSON.parse(origin.toString("utf-8")) as ITodoList;
  if (originData.list.length != currentData.list.length) {
    if (currentData.list.length - originData.list.length > 0) {
      console.log(
        "🔥 [알림] 추가된 데이터가 있습니다. (%d개)",
        currentData.list.length - originData.list.length
      );
      counterSet("New", currentData.list.length - originData.list.length);
    } else if (currentData.list.length - originData.list.length < 0) {
      console.log(
        "🔥 [알림] 누락된 데이터가 있습니다. (%d개)",
        originData.list.length - currentData.list.length
      );
      counterSet("Delete", currentData.list.length - originData.list.length);
    }
    // return currentData.list.length - originData.list.length;
  }
  let diff = 0;
  for (let i = 0; i < originData.list.length; i++) {
    const origin = originData.list[i];
    const current = currentData.list[i];
    if (origin && current) {
      const isSame =
        current.id === origin.id &&
        current.content === origin.content &&
        current.process === origin.process;
      if (!isSame) {
        diff += 1;
      }
    }
  }
  if (diff > 0) {
    console.log("🔥 [알림] 데이터 내용이 다른 부분이 존재합니다. (%d개)", diff);
    counterSet("Update", diff);
  }
  // return diff;
}
