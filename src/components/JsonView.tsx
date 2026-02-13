import type React from "react";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { xcodeDark, xcodeLight } from "@uiw/codemirror-themes-all";

interface JsonViewProps {
  data: any;
  theme: string;
}

export const JsonView: React.FC<JsonViewProps> = ({ data, theme }) => {
  const isText = typeof data === "string";
  const isObject = typeof data === "object" && data !== null;

  if (!isText && !isObject) {
    return <div>Invalid JSON data</div>;
  }
  if (isText) {
    return (
      <CodeMirror
        value={data}
        extensions={[EditorView.lineWrapping]}
        readOnly
        height="auto"
        theme={theme === "light" ? xcodeLight : xcodeDark}
        width="100%"
      />
    );
  }

  // Create a deep copy and transform repository fields like
  // "ftvc-org/github-actions-maven-release-sample" -> "github-actions-maven-release-sample"
  const transform = (input: any): any => {
    if (Array.isArray(input)) {
      return input.map(transform);
    }
    if (input && typeof input === "object") {
      const out: any = {};
      for (const [k, v] of Object.entries(input)) {
        if (k === "repository" && typeof v === "string") {
          const parts = v.split("/");
          out[k] = parts.length > 1 ? parts[parts.length - 1] : v;
        } else {
          out[k] = transform(v);
        }
      }
      return out;
    }
    return input;
  };

  const transformed = transform(data);

  return (
    <CodeMirror
      value={JSON.stringify(transformed, null, 2)}
      extensions={[json()]}
      readOnly
      height="auto"
      theme={theme === "light" ? xcodeLight : xcodeDark}
      width="100%"
    />
  );
};

export default JsonView;
