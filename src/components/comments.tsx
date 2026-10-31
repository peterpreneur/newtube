"use client";

import { useRef, useState } from "react";
import {
  MoreVerticalIcon,
  SortIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "@/components/icons";
import { InitialAvatar, UserAvatar } from "@/components/user-avatar";
import type { Comment } from "@/lib/comments";
import { formatAge, formatCount } from "@/lib/format";

type SortOrder = "top" | "newest";
type Vote = "like" | "dislike";

type CommentsProps = {
  initialComments: Comment[];
  totalCount: number;
};

export function Comments({ initialComments, totalCount }: CommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [sort, setSort] = useState<SortOrder>("top");
  const [sortOpen, setSortOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = [...comments].sort((a, b) =>
    sort === "top" ? b.likes - a.likes : a.hoursAgo - b.hoursAgo,
  );
  const count = totalCount + (comments.length - initialComments.length);

  function submit() {
    const text = draft.trim();
    if (!text) return;
    setComments((list) => [
      {
        id: `local-${list.length}-${text.length}`,
        author: "You",
        avatarColor: "#1d4ed8",
        hoursAgo: 0,
        text,
        likes: 0,
      },
      ...list,
    ]);
    setSort("newest");
    setDraft("");
    setComposing(false);
  }

  function reply(author: string) {
    setDraft(`@${author} `);
    setComposing(true);
    inputRef.current?.focus();
  }

  function toggleVote(id: string, vote: Vote) {
    setVotes((current) => {
      const next = { ...current };
      if (next[id] === vote) {
        delete next[id];
      } else {
        next[id] = vote;
      }
      return next;
    });
  }

  return (
    <section className="mt-6 px-4 pb-6 sm:px-0" aria-label="Comments">
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-bold text-zinc-900">
          {count.toLocaleString()} Comments
        </h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((value) => !value)}
            aria-expanded={sortOpen}
            className="flex items-center gap-2 text-sm font-medium text-zinc-900"
          >
            <SortIcon className="h-6 w-6" />
            Sort by
          </button>
          {sortOpen ? (
            <div
              role="menu"
              className="absolute top-9 left-0 z-10 w-44 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg"
            >
              {(
                [
                  ["top", "Top comments"],
                  ["newest", "Newest first"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={sort === value}
                  onClick={() => {
                    setSort(value);
                    setSortOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 ${
                    sort === value ? "bg-zinc-100 font-medium" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <form
        className="mt-6 flex gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <UserAvatar className="h-10 w-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <label htmlFor="add-comment" className="sr-only">
            Add a comment
          </label>
          <input
            ref={inputRef}
            id="add-comment"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onFocus={() => setComposing(true)}
            placeholder="Add a comment..."
            autoComplete="off"
            className="w-full border-b border-zinc-300 pt-2 pb-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-zinc-900"
          />
          {composing ? (
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setComposing(false);
                }}
                className="h-9 rounded-full px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!draft.trim()}
                className="h-9 rounded-full bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700 disabled:bg-zinc-100 disabled:text-zinc-400"
              >
                Comment
              </button>
            </div>
          ) : null}
        </div>
      </form>

      <ul className="mt-6 flex flex-col gap-6">
        {sorted.map((comment) => {
          const vote = votes[comment.id];
          return (
            <li key={comment.id} className="flex gap-4">
              <InitialAvatar
                name={comment.author}
                color={comment.avatarColor}
                className="h-10 w-10 text-base"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13px]">
                  <span className="font-semibold text-zinc-900">
                    {comment.author === "You" ? "@you" : comment.author}
                  </span>{" "}
                  <span className="text-zinc-600">{formatAge(comment.hoursAgo)}</span>
                </p>
                <p className="mt-0.5 text-sm break-words whitespace-pre-line text-zinc-900">
                  {comment.text}
                </p>
                <div className="mt-1 -ml-2 flex items-center text-xs text-zinc-600">
                  <button
                    type="button"
                    onClick={() => toggleVote(comment.id, "like")}
                    aria-pressed={vote === "like"}
                    aria-label="Like comment"
                    className="rounded-full p-2 text-zinc-900 hover:bg-zinc-100"
                  >
                    <ThumbUpIcon filled={vote === "like"} className="h-5 w-5" />
                  </button>
                  <span className="mr-2 min-w-6">
                    {comment.likes + (vote === "like" ? 1 : 0) > 0
                      ? formatCount(comment.likes + (vote === "like" ? 1 : 0))
                      : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleVote(comment.id, "dislike")}
                    aria-pressed={vote === "dislike"}
                    aria-label="Dislike comment"
                    className="rounded-full p-2 text-zinc-900 hover:bg-zinc-100"
                  >
                    <ThumbDownIcon filled={vote === "dislike"} className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => reply(comment.author)}
                    className="ml-4 h-8 rounded-full px-3 text-xs font-medium text-zinc-900 hover:bg-zinc-100"
                  >
                    Reply
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="h-10 w-10 shrink-0 self-start rounded-full p-2 text-zinc-900 hover:bg-zinc-100"
                aria-label="Comment actions"
              >
                <MoreVerticalIcon className="h-6 w-6" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
