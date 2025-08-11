"use client";

import { Loader2 } from "lucide-react";
import { useCommentsQuery } from "./use-comments-hooks";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/lib/utils";
import { CommentForm } from "./CommentForm";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";

export default function CommentsListScroll() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useCommentsQuery();

  const comments = data?.pages.flatMap((page) => page.comments);

  if (isPending) {
    return <Loader2 className="animate-spin mx-auto" />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Comments ({data?.pages[0].totalComments ?? "-"})
      </h2>

      <CommentForm />

      {isLoading && <p className="mb-4 text-blue-500">Loading comments...</p>}

      {/* {isError && (
        <div className="mb-4 text-red-500">
          Error loading comments: {error?.message}
        </div>
      )} */}

      {!isLoading && !isError && comments?.length === 0 && (
        <div className="mb-4">No comments yet.</div>
      )}

      {comments && comments?.length > 0 && (
        <div className="space-y-3 mb-5">
          {comments && comments.length > 0 && (
            <InfiniteScrollContainer
              onBottomReached={() =>
                hasNextPage && !isFetching && fetchNextPage()
              }
              className="space-y-3"
            >
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-3 border rounded-lg bg-white"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {comment.user.avatar}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{comment.user.name}</p>
                      <span className="text-xs text-gray-500">
                        {formatRelativeDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
              {isFetchingNextPage && (
                <div className="flex justify-center my-4">
                  <Loader2 className="animate-spin" />
                </div>
              )}
            </InfiniteScrollContainer>
          )}
          {!isError && !comments?.length && (
            <div className="text-center">No comments yet.</div>
          )}
          {isError && (
            <div className="text-center text-red-500">
              Error loading comments: {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
