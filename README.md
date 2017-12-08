# heartbeat

```js
var heartbeat = require('@ersinfotech/heartbeat')

if (process.env.NODE_ENV === 'production') {
  heartbeat({
    disableDetectRequest: false,
    detectRequestInterval: 15, // 分鐘
  })
}
```

### options

```graphql
type Options {
  id: String
  disableDetectRequest: Boolean = false
  disableRestart: Boolean = false
  detectRequestInterval: Int = 15
}
```