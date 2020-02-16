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
