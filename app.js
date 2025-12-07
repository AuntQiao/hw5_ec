import { h } from "https://esm.sh/preact";
import { useState, useEffect } from "https://esm.sh/preact/hooks";

const BIN_ID = "YOUR_BIN_ID";
const API_KEY = "YOUR_API_KEY";

const API_URL = `https://api.jsonbin.io/v3/b/6934fc9fd0ea881f4017f053`;

export default function App() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", desc: "", img: "" });
  const [editIndex, setEditIndex] = useState(null);

  // GET data
  async function loadData() {
    const res = await fetch(API_URL, {
      headers: { "X-Master-Key": API_KEY }
    });
    const json = await res.json();
    setProjects(json.record || []);
  }

  // CREATE or UPDATE
  async function saveProject(e) {
    e.preventDefault();

    let updated = [...projects];
    if (editIndex !== null) updated[editIndex] = form;
    else updated.push(form);

    await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(updated)
    });

    setForm({ title: "", desc: "", img: "" });
    setEditIndex(null);
    loadData();
  }

  function startEdit(i) {
    setEditIndex(i);
    setForm(projects[i]);
  }

  async function deleteProject(i) {
    let updated = projects.filter((_, idx) => idx !== i);

    await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(updated)
    });

    loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return h("div", { class: "container" }, [
    h("h1", {}, "Preact CRUD - HW5 EC Version"),

    // FORM
    h("form", { onSubmit: saveProject }, [
      h("input", {
        placeholder: "Title",
        value: form.title,
        onInput: (e) => setForm({ ...form, title: e.target.value })
      }),
      h("input", {
        placeholder: "Description",
        value: form.desc,
        onInput: (e) => setForm({ ...form, desc: e.target.value })
      }),
      h("input", {
        placeholder: "Image URL",
        value: form.img,
        onInput: (e) => setForm({ ...form, img: e.target.value })
      }),
      h(
        "button",
        { type: "submit" },
        editIndex !== null ? "Update" : "Create"
      )
    ]),

    // LIST
    h(
      "div",
      { class: "list" },
      projects.map((p, i) =>
        h("div", { class: "card" }, [
          h("h3", {}, p.title),
          p.img ? h("img", { src: p.img }) : null,
          h("p", {}, p.desc),
          h("button", { onClick: () => startEdit(i) }, "Edit"),
          h("button", { onClick: () => deleteProject(i) }, "Delete")
        ])
      )
    )
  ]);
}
