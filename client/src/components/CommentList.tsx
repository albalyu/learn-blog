import Comment from './Comment';
import type { IComment } from '../types';

interface CommentListProps {
  comments: IComment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div>
      {comments.map((comment: IComment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
