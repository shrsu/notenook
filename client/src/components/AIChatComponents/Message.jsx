import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const extractCodeBlock = (part) => {
  const match = part.match(/^```(\w+)\n([\s\S]*)\n```$/);
  if (match) {
    const language = match[1];
    const codeBlock = match[2].trim();
    return { language, codeBlock };
  } else {
    return { language: null, codeBlock: part };
  }
};

const renderContent = (content) => {
  const parts = content.split(/(```[^`]*```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const { language, codeBlock } = extractCodeBlock(part);
      return (
        <div key={index}>
          <div className="code-language text-xs text-gray-500 px-4 py-1 rounded-t-md bg-gray-800">
            {language}
          </div>
          <SyntaxHighlighter language={language} style={duotoneDark}>
            {codeBlock}
          </SyntaxHighlighter>
        </div>
      );
    } else {
      return (
        <ReactMarkdown key={index} className="p-4 rounded-lg shadow-md">
          {part}
        </ReactMarkdown>
      );
    }
  });
};

const Message = ({ role, content }) => {
  return (
    <div
      className={`${
        role === "user" ? "self-end" : "self-start"
      } bg-neutral-900 max-w-[90%] rounded-md mb-3 p-2`}
    >
      <div className={`message-content ${role}`}>{renderContent(content)}</div>
    </div>
  );
};

export default Message;
