// TODO
// - [ ] 새로고침 시 변수에 저장된 정렬 데이터 초기화되는 문제
// => localstorage에 저장
// - [ ] 총 개수 표시 - list
// - [ ] 반복 클릭 방지 - list
// - [ ] 무한 스크롤 : 더보기 버튼 클릭 이벤트로 - list

// 할일 목록
import Header from "../../layout/Header.js";
import Footer from "../../layout/Footer.js";

import { linkTo } from "../../Router.js";

//무한 스크롤
// const btnScroll = document.createElement("div");
// btnScroll.setAttribute("id", "btnScroll");
// btnScroll.addEventListener("click", (e)=>{

// })

// 정렬 함수
const sortItems = (items, key, order) => {
  return items.sort((a, b) => {
    if (order === "asc") {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

const TodoList = async function () {
  const page = document.createElement("div");
  page.setAttribute("id", "page");
  page.className = "list";

  const containerList = document.createElement("div");
  containerList.setAttribute("id", "container-list");

  const contentDone = document.createElement("div");
  const contentNotDone = document.createElement("div");
  contentDone.setAttribute("id", "content-done");
  contentNotDone.setAttribute("id", "content-not-done");

  let response;

  try {
    async function onCheckboxHandler(e) {
      const checkbox = e.target;
      const li = checkbox.parentElement;
      const id = li.id;

      try {
        await axios.patch(`http://localhost:33088/api/todolist/${id}`, {
          done: checkbox.checked,
        });
      } catch (error) {
        console.log(error);
      }

      response = await axios("http://localhost:33088/api/todolist");
      makeTodolist(response.data.items);

      // if (checkbox.checked) {
      //   contentDone.appendChild(li);
      // } else {
      //   contentNotDone.appendChild(li);
      // }
    }

    async function updateTodoStatus(id, isDone) {
      try {
        await axios.patch(`http://localhost:33088/api/todolist/${id}`, {
          done: isDone,
        });

        const response = await axios("http://localhost:33088/api/todolist");
        makeTodolist(response.data.items);
      } catch (error) {
        console.log(error);
      }
    }

    response = await axios("http://localhost:33088/api/todolist");
    console.log(response);

    // if (!response.data?.items) {
    //   throw new Error('데이터가 없습니다.');
    // }

    let currentDropdown = "createdAt_asc";

    function createDropdown(parentElement) {
      const sortDropdown = document.createElement("select");

      const option1 = new Option("생성날짜 오래된순", "createdAt_desc");
      const option2 = new Option("생성날짜 최신순", "createdAt_asc");

      sortDropdown.appendChild(option1);
      sortDropdown.appendChild(option2);

      sortDropdown.value = currentDropdown;

      sortDropdown.addEventListener("change", (e) => {
        currentDropdown = e.target.value;
        const [key, order] = e.target.value.split("_");
        makeTodolist(response.data.items);
      });

      parentElement.appendChild(sortDropdown);
    }

    function createSectionTitle(title, parentElement) {
      const h3Element = document.createElement("h3");
      h3Element.textContent = title;
      parentElement.appendChild(h3Element);
    }

    createSectionTitle("Done", contentDone);
    createSectionTitle("Todo", contentNotDone);

    makeTodolist(response.data.items);

    // drop
    async function drop(e, isDone) {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      await updateTodoStatus(id, isDone);
    }

    // allow drop
    function allowDrop(e) {
      e.preventDefault();
    }

    // drag & drop event 추가
    contentDone.ondragover = allowDrop;
    contentDone.ondrop = (e) => drop(e, true);
    contentNotDone.ondragover = allowDrop;
    contentNotDone.ondrop = (e) => drop(e, false);

    createDropdown(containerList);
    function makeTodolist(items) {
      contentDone.innerHTML = "";
      contentNotDone.innerHTML = "";
      createSectionTitle("Done", contentDone);
      createSectionTitle("Todo", contentNotDone);

      let countNotDone = 0;
      let countDone = 0;

      const countDoneElement = document.createElement("span");
      const countNotDoneElement = document.createElement("span");
      contentDone.appendChild(countDoneElement);
      contentNotDone.appendChild(countNotDoneElement);

      sortItems(items).forEach(function (item) {
        const title = document.createTextNode(item.title);

        const li = document.createElement("div");
        li.draggable = true;
        li.id = item._id;
        li.ondragstart = (e) => {
          e.dataTransfer.setData("text/plain", e.target.id);
        };

        //상세페이지 이동을 위한 a태그 속성
        const todoInfoLink = document.createElement("a");
        todoInfoLink.setAttribute("id", item._id);
        todoInfoLink.setAttribute("href", `info?_id=${item._id}`);
        todoInfoLink.appendChild(title);
        todoInfoLink.addEventListener("click", function (event) {
          event.preventDefault();
          linkTo(todoInfoLink.getAttribute("href"));
        });

        // todo item의 checkbox 속성
        const checkbox = document.createElement("input");
        checkbox.setAttribute("id", "checkbox");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "checkbox");
        checkbox.setAttribute("checked", false);
        checkbox.checked = item.done;
        li.appendChild(checkbox);
        li.appendChild(todoInfoLink);
        checkbox.addEventListener("click", onCheckboxHandler);

        if (item.done) {
          contentDone.appendChild(li);
          countDone++;
        } else {
          contentNotDone.appendChild(li);
          countNotDone++;
        }
      });

      countDoneElement.textContent = `완료된 할 일 ${countDone}개`;
      countNotDoneElement.textContent = `해야할 할 일 ${countNotDone}개`;
    }

    //등록 버튼
    const btnRegist = document.createElement("button");
    const btnTitle = document.createTextNode("등록");
    btnRegist.appendChild(btnTitle);
    page.appendChild(btnRegist);

    btnRegist.addEventListener("click", () => {
      linkTo("regist");
    });
  } catch (err) {
    const error = document.createTextNode("일시적인 오류 발생");
    page.appendChild(error);
  }

  page.appendChild(Header("TODO App 목록 조회"));
  page.appendChild(containerList);
  page.appendChild(contentDone);
  page.appendChild(contentNotDone);
  page.appendChild(Footer());
  return page;
};

export default TodoList;
