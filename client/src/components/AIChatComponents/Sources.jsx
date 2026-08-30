/**
 * Shows which notes an answer was drawn from.
 *
 * This is the visible difference between the assistant guessing and the
 * assistant reading: every claim traces back to a note the user wrote.
 */
const Sources = ({ sources }) => {
  if (!sources?.length) return null;

  return (
    <div className="flex flex-wrap gap-1 px-2 pb-2 -mt-2">
      <span className="text-[10px] text-gray-500 self-center mr-1">Sources</span>
      {sources.map((source) => (
        <span
          key={source.n}
          title={`similarity ${source.score.toFixed(3)}`}
          className="text-[10px] bg-neutral-800 text-gray-300 rounded px-2 py-[2px] border border-neutral-700"
        >
          [{source.n}] {source.source}
        </span>
      ))}
    </div>
  );
};

export default Sources;
