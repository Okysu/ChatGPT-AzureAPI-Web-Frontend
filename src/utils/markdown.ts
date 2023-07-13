import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { mangle } from "marked-mangle";
import markedKatex from "marked-katex-extension";

marked.use(mangle());

marked.use(
  markedKatex({
    throwOnError: false,
    globalGroup: true,
  })
);

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      const preCode = hljs.highlight(code, { language }).value;
      return preCode;
    },
  })
);

marked.use(
  gfmHeadingId({
    prefix: "prefix-",
  })
);

marked.setOptions({
  breaks: true,
});

export const markdownToHtml = (markdown: string) => {
  return marked.parse(markdown);
};
// copy text
export const copyText = (id: string) => {
  // check permission
  if (!navigator.clipboard) {
    window.postMessage({ type: "copy", value: "error" }, "*");
    return;
  }
  const copyText = document.getElementById(id);
  if (copyText) {
    navigator.clipboard.writeText(copyText.innerText).then(
      () => {
        window.postMessage({ type: "copy", value: "success" }, "*");
      },
      () => {
        window.postMessage({ type: "copy", value: "error" }, "*");
      }
    );
  }
};
