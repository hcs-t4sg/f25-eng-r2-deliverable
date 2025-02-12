"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Comment = {
  id: number;
  species_id: number;
  user_id: string;
  content: string;
  created_at: string;
};

export default function Comments({
  speciesId,
  sessionId,
}: {
  speciesId: number;
  sessionId: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("species_id", speciesId)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching comments:", error.message);
      else setComments(
        data.map((comment) => ({
          ...comment,
          created_at: comment.created_at ?? "",
        }))
      );
    };

    fetchComments();
  }, [speciesId, supabase]);

 
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase.from("comments").insert([
      {
        species_id: speciesId,
        user_id: sessionId, 
        content: newComment.trim(),
      },
    ]);

    if (error) {
      console.error("Error adding comment:", error.message);
    } else {
      setNewComment(""); 
      window.location.reload(); 
    }
  };


  const handleDeleteComment = async (commentId: number) => {
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error.message);
    } else {
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  return (
    <div className="mt-5">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

    
      {sessionId && (
        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button onClick={handleAddComment}>Post</Button>
        </div>
      )}

  
      <div className="mt-3 space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                    <p>{comment.content}</p>
                    <small className="text-gray-500">{new Date(comment.created_at).toLocaleString()}</small>
                </div>
                {comment.user_id === sessionId && (
                <Button
                    variant="secondary"
                    className="mt-1"
                    onClick={() => handleDeleteComment(comment.id)}
                >
                    Delete
                </Button>
                )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}