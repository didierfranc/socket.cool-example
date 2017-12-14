const { createServer } = require('http')
const { get } = require('https')
const { parse } = require('url')
const { readFileSync } = require('fs')
const { v4 } = require('uuid')
const { createHash } = require('crypto')

const md5 = string =>
  createHash('md5')
    .update(string)
    .digest('hex')

const html = readFileSync('index.html', 'utf8')
let messages = ['hello world']

setInterval(() => (messages = ['hello world']), 10 * 60 * 1000)

const server = createServer((req, res) => {
  const { pathname } = parse(req.url)

  const post = pathname.match(/\/messages\/post\/(.+)/)
  const list = pathname.match(/\/messages\/list/)

  if (post) {
    messages.push(post[1])
    get('https://app.socket.cool/notify/1/1', res => {
      const { statusCode } = res
      if (statusCode === 200) console.log('🚀')
    })
    res.end(JSON.stringify(messages))
  } else if (list) {
    res.end(JSON.stringify(messages))
  } else {
    res.end(
      html
        .replace('appid', md5('1'))
        .replace('channelid', 1)
        .replace('uuid', v4()),
    )
  }
})

server.listen(8080)
