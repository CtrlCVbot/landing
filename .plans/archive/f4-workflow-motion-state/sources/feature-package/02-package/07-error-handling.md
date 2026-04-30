# F4 Error Handling

F4는 런타임 API 호출이 없다. 주요 실패 모드는 copy overclaim, animation 과다, 모바일 overflow다.

| Failure | 대응 |
|---|---|
| 과장 문구 | 금지 문구 scan |
| animation 과다 | reduced motion guard |
| mobile overflow | 375px browser check |
