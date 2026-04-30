# F5 Error Handling

| 위험 | 대응 |
|---|---|
| asset path 누락 | tests에서 `public` 파일 존재 여부 확인 |
| metadata와 상수 불일치 | layout metadata test로 고정 |
| 외부 링크 보안 속성 누락 | header/footer tests로 고정 |
| raster 깨짐 | SVG 자산만 사용 |
