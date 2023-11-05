import TodoList from "./pages/list/TodoList";
import TodoRegist from "./pages/regist/TodoRegist";
import TodoInfo from "./pages/info/TodoInfo";
import TodoUpdate from "./pages/update/TodoUpdate";

async function getPage(): Promise<HTMLDivElement> {
  let page;
  switch (location.pathname) {
    case "/":
      page = await TodoList();
      break;
    case "/regist":
      page = TodoRegist();
      break;
    case "/info":
      page = await TodoInfo();
      break;
    case "/update":
      page = await TodoUpdate();
      break;
    default:
      page = await TodoList();
  }

  return page;
}

async function render() {
  const page = await getPage();
  const _page = document.querySelector("#page") as HTMLInputElement;
  _page.replaceWith(page);
}

window.addEventListener("popstate", render);

export function linkTo(url: string) {
  history.pushState({}, "todo", url);
  render();
}

const Router = async function (): Promise<HTMLDivElement> {
  return await getPage();
};

export default Router;
