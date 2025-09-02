import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as commentService from "../services/commentService";

const CommentContext = createContext();
export const useCommentContext = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const useComments = (taskId, page = 1, limit = 20) =>
    useQuery(
      ["comments", taskId, page, limit],
      () => commentService.list(taskId, { page, limit }),
      {
        keepPreviousData: true,
      }
    );

  const useCreateComment = (taskId) =>
    useMutation((data) => commentService.create(taskId, data), {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", taskId]);
      },
    });

  const useUpdateComment = (taskId) =>
    useMutation(
      ({ commentId, ...data }) => commentService.update(commentId, data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["comments", taskId]);
        },
      }
    );

  const useDeleteComment = (taskId) =>
    useMutation((commentId) => commentService.remove(commentId), {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", taskId]);
      },
    });

  return (
    <CommentContext.Provider
      value={{
        useComments,
        useCreateComment,
        useUpdateComment,
        useDeleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
