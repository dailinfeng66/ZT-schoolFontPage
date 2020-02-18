import request from '@/utils/request'

export function getComment(topic_id) {
  return request({
    url: 'comment/mgr/comment_base/1/100',
    method: 'post',
    params: {topic_id}
     
  })
}
export function getReply(comment_id) {
  return request({
    url: 'comment/mgr/comment_reply/1/100',
    method: 'post',
    params: {comment_id}
  })
}

//删除评论
export function deleteComment(comment_id) {
  return request({
    url: 'comment/comment_base/'+comment_id,
    method: 'delete',
  })
}
export function deleteReply(reply_id) {
  return request({
    url: 'comment/comment_reply/'+reply_id,
    method: 'delete',
  })
}