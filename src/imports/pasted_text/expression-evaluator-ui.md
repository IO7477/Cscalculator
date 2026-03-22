---

## 1. Top bar – `Header / Expressions`

- Frame: 390×88, white, bottom radius 24.
- Left:
    - `Toolbox` (12, gray‑600).
    - `Expression Evaluator` (24, bold, near‑black).
- Right: 32×32 pill `?` (help), 32×32 pill `⋯`.
- Back chevron on far left.

---

## 2. Segmented control – `Mode selector`

Two phases: conversion then evaluation.

- Frame: 358×44, pill radius 999, fill `#F9FAFB`, margin 16.
- Segments (179×36):
    - `Infix → Postfix` (selected).
    - `Evaluate postfix`.

---

## 3. Card – `Infix input`

Primary input for infix expression.

- Frame: 358×80, radius 16, `#F3F4F6` fill, stroke `#E5E7EB`, margin 16.
- Padding 12.
- Label: `Infix expression` (12, gray‑600).
- Text field: placeholder `8 4 / 3 - 5 * 6 + 7 - 2 * 9 / (2 + 3 - 8) 9` (monospace 14).
- Helper: `Operands, +, -, *, /, (, )` (11, gray‑500).[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/156306340/1431c0e5-c3cf-47de-bf03-052ee4bf3ba1/CC4-Evaluation-of-Expressions-1.pdf?AWSAccessKeyId=ASIA2F3EMEYESMNYJZTQ&Signature=sol9oAGBz49%2BEGX7Ip0oU6CCmWE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEID%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFZiIhpNoPaWlGBan028PcumFpuAFIb1UrQYx47Bp90BAiEApy5GuLZOcmjgkrn1R9NvWszHGcvMfLNt97xnOxa%2B%2Fgsq8wQISRABGgw2OTk3NTMzMDk3MDUiDAIJ2%2BIRxhG5rCVknCrQBOnozykL8LG2CiiRDf9HPUtdQ8kDbBi8ckz61ttESN0%2FVnoSerBr7AEPhErEaJiXvKo2N27wafm4SzmAyb2rVnfFZOWuuhfqBs3PTifXrLTqbnujrQnbOPpmiHrTtsskpqMYReHQYov%2BiUZyBXGn%2BwSGXPQNs%2B9y89zIz3QDj%2BrD%2Fi6sUEiE1MVSgB4y%2B51paeiInLFGaAZnhOK2gAIUepxabyeoakbF4E8U5HuBUlwv0hThphU54zaqL9WXCOFCbGP0k6U5hSLDJo%2FscaSIwejgVVcgQ2wqYjzBFeIxuzMJcmlMnub75%2Bq96QnglsT4iZgbphI%2Bv2IG%2FJwKxrePwMpXWufTc4i0qF%2FqXLc66L4pKX82E6LKXAErMkrj%2FZQsKpZu7zHpKybavTlKSondi2S7hn15qmU5T6I%2BpcWcA4u78I5p3y7oyEWxqN9wwhZSMalpG1HVKxG1%2B2sC5%2FJjzprWsqoGUWyuX2r5sKNmstykP9ddCP07CQZB4F7Wr1D8VVYVJd8RSwFapmc8NY4l4qzky5uhlrbY2MnOO5zndxnGvHIfACBh2xJmuvgpnbzsYFgZ59q2IdRBiWd%2FCvB4%2BE6OmqvtIGmXm2VkYkzqsCD1%2B9Y2piQs0Wu0UA3bRQZEQE5giUj3jzqN%2BOWJxaFjqj3C3bAitgWaWNQSxay3yEsj4mNf56szMu8E90MpEUhJIe1T2z1XHq4vPBvYabmtPyNzRrVuZTXhHuWrFYbZN4qX4%2BCMxACAGKcydSJKhkQImIidj4iXcuHoXaQTKCECZ90wvY75zQY6mAHC8pQ123Z899dHcpWN7vX71%2B3loE5SIsJoE9zdiIbFkoJvzUQyYiNIHjx4O4aBa5UJli0IAW9BZTuVTunqeP1wryo%2FiqAWS461v2XoAD9%2FLHFpEnVwvgusmtdxwTgE2qOkT%2Bhys6TICPgU3VCYCDLtgacyYBPIhmBTc8OAgTJ%2BfslMhFCa1xB9e5RpjM%2FOrVENTSE9jAFFWA%3D%3D&Expires=1774079079)]

---

## 4. Card – `Operator precedence table`

Fixed reference table from PDF (ISP/ICP values).[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/156306340/1431c0e5-c3cf-47de-bf03-052ee4bf3ba1/CC4-Evaluation-of-Expressions-1.pdf?AWSAccessKeyId=ASIA2F3EMEYESMNYJZTQ&Signature=sol9oAGBz49%2BEGX7Ip0oU6CCmWE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEID%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFZiIhpNoPaWlGBan028PcumFpuAFIb1UrQYx47Bp90BAiEApy5GuLZOcmjgkrn1R9NvWszHGcvMfLNt97xnOxa%2B%2Fgsq8wQISRABGgw2OTk3NTMzMDk3MDUiDAIJ2%2BIRxhG5rCVknCrQBOnozykL8LG2CiiRDf9HPUtdQ8kDbBi8ckz61ttESN0%2FVnoSerBr7AEPhErEaJiXvKo2N27wafm4SzmAyb2rVnfFZOWuuhfqBs3PTifXrLTqbnujrQnbOPpmiHrTtsskpqMYReHQYov%2BiUZyBXGn%2BwSGXPQNs%2B9y89zIz3QDj%2BrD%2Fi6sUEiE1MVSgB4y%2B51paeiInLFGaAZnhOK2gAIUepxabyeoakbF4E8U5HuBUlwv0hThphU54zaqL9WXCOFCbGP0k6U5hSLDJo%2FscaSIwejgVVcgQ2wqYjzBFeIxuzMJcmlMnub75%2Bq96QnglsT4iZgbphI%2Bv2IG%2FJwKxrePwMpXWufTc4i0qF%2FqXLc66L4pKX82E6LKXAErMkrj%2FZQsKpZu7zHpKybavTlKSondi2S7hn15qmU5T6I%2BpcWcA4u78I5p3y7oyEWxqN9wwhZSMalpG1HVKxG1%2B2sC5%2FJjzprWsqoGUWyuX2r5sKNmstykP9ddCP07CQZB4F7Wr1D8VVYVJd8RSwFapmc8NY4l4qzky5uhlrbY2MnOO5zndxnGvHIfACBh2xJmuvgpnbzsYFgZ59q2IdRBiWd%2FCvB4%2BE6OmqvtIGmXm2VkYkzqsCD1%2B9Y2piQs0Wu0UA3bRQZEQE5giUj3jzqN%2BOWJxaFjqj3C3bAitgWaWNQSxay3yEsj4mNf56szMu8E90MpEUhJIe1T2z1XHq4vPBvYabmtPyNzRrVuZTXhHuWrFYbZN4qX4%2BCMxACAGKcydSJKhkQImIidj4iXcuHoXaQTKCECZ90wvY75zQY6mAHC8pQ123Z899dHcpWN7vX71%2B3loE5SIsJoE9zdiIbFkoJvzUQyYiNIHjx4O4aBa5UJli0IAW9BZTuVTunqeP1wryo%2FiqAWS461v2XoAD9%2FLHFpEnVwvgusmtdxwTgE2qOkT%2Bhys6TICPgU3VCYCDLtgacyYBPIhmBTc8OAgTJ%2BfslMhFCa1xB9e5RpjM%2FOrVENTSE9jAFFWA%3D%3D&Expires=1774079079)]

- Frame: 358×140, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Compact table (2 columns):
    
    `textSymbol | ISP | ICP
    ------|-----|----
    (     | -1  | -1
    + -   | 1   | 1
    * /   | 2   | 2
    ^     | 3   | 4`
    
- Title: `Precedence (ISP / ICP)` (12, semibold).

---

## 5. Circle button – `Convert`

- 44×44 circle, white/gray stroke/shadow, centered.
- Icon: `→` (arrow right).

---

## 6. Card – `Postfix result`

Output of conversion.

- Frame: 358×96, radius 16, `#111827` fill, margin 16.
- Padding 12.
- Header: `Postfix` (12, gray‑300) + copy `📋`.
- Large result: `8 4 3 - 5 6 * 7 2 9 * 3 8 - 2 + / - 9 +` (monospace 16, white).[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/156306340/1431c0e5-c3cf-47de-bf03-052ee4bf3ba1/CC4-Evaluation-of-Expressions-1.pdf?AWSAccessKeyId=ASIA2F3EMEYESMNYJZTQ&Signature=sol9oAGBz49%2BEGX7Ip0oU6CCmWE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEID%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFZiIhpNoPaWlGBan028PcumFpuAFIb1UrQYx47Bp90BAiEApy5GuLZOcmjgkrn1R9NvWszHGcvMfLNt97xnOxa%2B%2Fgsq8wQISRABGgw2OTk3NTMzMDk3MDUiDAIJ2%2BIRxhG5rCVknCrQBOnozykL8LG2CiiRDf9HPUtdQ8kDbBi8ckz61ttESN0%2FVnoSerBr7AEPhErEaJiXvKo2N27wafm4SzmAyb2rVnfFZOWuuhfqBs3PTifXrLTqbnujrQnbOPpmiHrTtsskpqMYReHQYov%2BiUZyBXGn%2BwSGXPQNs%2B9y89zIz3QDj%2BrD%2Fi6sUEiE1MVSgB4y%2B51paeiInLFGaAZnhOK2gAIUepxabyeoakbF4E8U5HuBUlwv0hThphU54zaqL9WXCOFCbGP0k6U5hSLDJo%2FscaSIwejgVVcgQ2wqYjzBFeIxuzMJcmlMnub75%2Bq96QnglsT4iZgbphI%2Bv2IG%2FJwKxrePwMpXWufTc4i0qF%2FqXLc66L4pKX82E6LKXAErMkrj%2FZQsKpZu7zHpKybavTlKSondi2S7hn15qmU5T6I%2BpcWcA4u78I5p3y7oyEWxqN9wwhZSMalpG1HVKxG1%2B2sC5%2FJjzprWsqoGUWyuX2r5sKNmstykP9ddCP07CQZB4F7Wr1D8VVYVJd8RSwFapmc8NY4l4qzky5uhlrbY2MnOO5zndxnGvHIfACBh2xJmuvgpnbzsYFgZ59q2IdRBiWd%2FCvB4%2BE6OmqvtIGmXm2VkYkzqsCD1%2B9Y2piQs0Wu0UA3bRQZEQE5giUj3jzqN%2BOWJxaFjqj3C3bAitgWaWNQSxay3yEsj4mNf56szMu8E90MpEUhJIe1T2z1XHq4vPBvYabmtPyNzRrVuZTXhHuWrFYbZN4qX4%2BCMxACAGKcydSJKhkQImIidj4iXcuHoXaQTKCECZ90wvY75zQY6mAHC8pQ123Z899dHcpWN7vX71%2B3loE5SIsJoE9zdiIbFkoJvzUQyYiNIHjx4O4aBa5UJli0IAW9BZTuVTunqeP1wryo%2FiqAWS461v2XoAD9%2FLHFpEnVwvgusmtdxwTgE2qOkT%2Bhys6TICPgU3VCYCDLtgacyYBPIhmBTc8OAgTJ%2BfslMhFCa1xB9e5RpjM%2FOrVENTSE9jAFFWA%3D%3D&Expires=1774079079)]
- Meta: `Tokens: 15` (11, gray‑400).

---

## 7. Scrollable card – `Conversion steps`

Core educational feature showing PDF algorithm table (TOKEN X, STACK Y, OUTPUT).[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/156306340/1431c0e5-c3cf-47de-bf03-052ee4bf3ba1/CC4-Evaluation-of-Expressions-1.pdf?AWSAccessKeyId=ASIA2F3EMEYESMNYJZTQ&Signature=sol9oAGBz49%2BEGX7Ip0oU6CCmWE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEID%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFZiIhpNoPaWlGBan028PcumFpuAFIb1UrQYx47Bp90BAiEApy5GuLZOcmjgkrn1R9NvWszHGcvMfLNt97xnOxa%2B%2Fgsq8wQISRABGgw2OTk3NTMzMDk3MDUiDAIJ2%2BIRxhG5rCVknCrQBOnozykL8LG2CiiRDf9HPUtdQ8kDbBi8ckz61ttESN0%2FVnoSerBr7AEPhErEaJiXvKo2N27wafm4SzmAyb2rVnfFZOWuuhfqBs3PTifXrLTqbnujrQnbOPpmiHrTtsskpqMYReHQYov%2BiUZyBXGn%2BwSGXPQNs%2B9y89zIz3QDj%2BrD%2Fi6sUEiE1MVSgB4y%2B51paeiInLFGaAZnhOK2gAIUepxabyeoakbF4E8U5HuBUlwv0hThphU54zaqL9WXCOFCbGP0k6U5hSLDJo%2FscaSIwejgVVcgQ2wqYjzBFeIxuzMJcmlMnub75%2Bq96QnglsT4iZgbphI%2Bv2IG%2FJwKxrePwMpXWufTc4i0qF%2FqXLc66L4pKX82E6LKXAErMkrj%2FZQsKpZu7zHpKybavTlKSondi2S7hn15qmU5T6I%2BpcWcA4u78I5p3y7oyEWxqN9wwhZSMalpG1HVKxG1%2B2sC5%2FJjzprWsqoGUWyuX2r5sKNmstykP9ddCP07CQZB4F7Wr1D8VVYVJd8RSwFapmc8NY4l4qzky5uhlrbY2MnOO5zndxnGvHIfACBh2xJmuvgpnbzsYFgZ59q2IdRBiWd%2FCvB4%2BE6OmqvtIGmXm2VkYkzqsCD1%2B9Y2piQs0Wu0UA3bRQZEQE5giUj3jzqN%2BOWJxaFjqj3C3bAitgWaWNQSxay3yEsj4mNf56szMu8E90MpEUhJIe1T2z1XHq4vPBvYabmtPyNzRrVuZTXhHuWrFYbZN4qX4%2BCMxACAGKcydSJKhkQImIidj4iXcuHoXaQTKCECZ90wvY75zQY6mAHC8pQ123Z899dHcpWN7vX71%2B3loE5SIsJoE9zdiIbFkoJvzUQyYiNIHjx4O4aBa5UJli0IAW9BZTuVTunqeP1wryo%2FiqAWS461v2XoAD9%2FLHFpEnVwvgusmtdxwTgE2qOkT%2Bhys6TICPgU3VCYCDLtgacyYBPIhmBTc8OAgTJ%2BfslMhFCa1xB9e5RpjM%2FOrVENTSE9jAFFWA%3D%3D&Expires=1774079079)]

- Frame: 358×auto (scrollable), radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Table rows (each 44px height):

`textTOKEN | STACK | OUTPUT
-----|-------|-------
8    | $     | 8
4    | $     | 8 4
/    | $/    | 8 4
...`

- Highlight current row in blue.
- Toggle: `Step through` / `All steps` (small switch at top).

---

## 8. Card – `Postfix evaluation` (active when "Evaluate postfix" mode)

- Frame: 358×96, radius 16, `#F3F4F6` fill, margin 16.
- Padding 12.
- Label: `Postfix result to evaluate` (12, gray‑600).
- Editable text: `8 4 3 - 5 6 * 7 2 9 * 3 8 - 2 + / - 9 +` (monospace 14).
- Helper: `Space‑separated tokens` (11, gray‑500).

---

## 9. Circle button – `Evaluate`

- Same style as convert button, icon `=` (equals).

---

## 10. Card – `Evaluation result`

Final computed value.

- Frame: 358×96, radius 16, `#10B981` fill (green success), margin 16.
- Padding 12.
- Header: `Answer` (12, white).
- Large value: `53` (monospace 24, white).[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/156306340/1431c0e5-c3cf-47de-bf03-052ee4bf3ba1/CC4-Evaluation-of-Expressions-1.pdf?AWSAccessKeyId=ASIA2F3EMEYESMNYJZTQ&Signature=sol9oAGBz49%2BEGX7Ip0oU6CCmWE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEID%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFZiIhpNoPaWlGBan028PcumFpuAFIb1UrQYx47Bp90BAiEApy5GuLZOcmjgkrn1R9NvWszHGcvMfLNt97xnOxa%2B%2Fgsq8wQISRABGgw2OTk3NTMzMDk3MDUiDAIJ2%2BIRxhG5rCVknCrQBOnozykL8LG2CiiRDf9HPUtdQ8kDbBi8ckz61ttESN0%2FVnoSerBr7AEPhErEaJiXvKo2N27wafm4SzmAyb2rVnfFZOWuuhfqBs3PTifXrLTqbnujrQnbOPpmiHrTtsskpqMYReHQYov%2BiUZyBXGn%2BwSGXPQNs%2B9y89zIz3QDj%2BrD%2Fi6sUEiE1MVSgB4y%2B51paeiInLFGaAZnhOK2gAIUepxabyeoakbF4E8U5HuBUlwv0hThphU54zaqL9WXCOFCbGP0k6U5hSLDJo%2FscaSIwejgVVcgQ2wqYjzBFeIxuzMJcmlMnub75%2Bq96QnglsT4iZgbphI%2Bv2IG%2FJwKxrePwMpXWufTc4i0qF%2FqXLc66L4pKX82E6LKXAErMkrj%2FZQsKpZu7zHpKybavTlKSondi2S7hn15qmU5T6I%2BpcWcA4u78I5p3y7oyEWxqN9wwhZSMalpG1HVKxG1%2B2sC5%2FJjzprWsqoGUWyuX2r5sKNmstykP9ddCP07CQZB4F7Wr1D8VVYVJd8RSwFapmc8NY4l4qzky5uhlrbY2MnOO5zndxnGvHIfACBh2xJmuvgpnbzsYFgZ59q2IdRBiWd%2FCvB4%2BE6OmqvtIGmXm2VkYkzqsCD1%2B9Y2piQs0Wu0UA3bRQZEQE5giUj3jzqN%2BOWJxaFjqj3C3bAitgWaWNQSxay3yEsj4mNf56szMu8E90MpEUhJIe1T2z1XHq4vPBvYabmtPyNzRrVuZTXhHuWrFYbZN4qX4%2BCMxACAGKcydSJKhkQImIidj4iXcuHoXaQTKCECZ90wvY75zQY6mAHC8pQ123Z899dHcpWN7vX71%2B3loE5SIsJoE9zdiIbFkoJvzUQyYiNIHjx4O4aBa5UJli0IAW9BZTuVTunqeP1wryo%2FiqAWS461v2XoAD9%2FLHFpEnVwvgusmtdxwTgE2qOkT%2Bhys6TICPgU3VCYCDLtgacyYBPIhmBTc8OAgTJ%2BfslMhFCa1xB9e5RpjM%2FOrVENTSE9jAFFWA%3D%3D&Expires=1774079079)]
- Meta: `Stack trace available →` (11, white, link style).

---

## 11. Scrollable card – `Evaluation stack trace`

Step‑by‑step postfix evaluation like PDF simulation.[[ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/156306340/1431c0e5-c3cf-47de-bf03-052ee4bf3ba1/CC4-Evaluation-of-Expressions-1.pdf?AWSAccessKeyId=ASIA2F3EMEYESMNYJZTQ&Signature=sol9oAGBz49%2BEGX7Ip0oU6CCmWE%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEID%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFZiIhpNoPaWlGBan028PcumFpuAFIb1UrQYx47Bp90BAiEApy5GuLZOcmjgkrn1R9NvWszHGcvMfLNt97xnOxa%2B%2Fgsq8wQISRABGgw2OTk3NTMzMDk3MDUiDAIJ2%2BIRxhG5rCVknCrQBOnozykL8LG2CiiRDf9HPUtdQ8kDbBi8ckz61ttESN0%2FVnoSerBr7AEPhErEaJiXvKo2N27wafm4SzmAyb2rVnfFZOWuuhfqBs3PTifXrLTqbnujrQnbOPpmiHrTtsskpqMYReHQYov%2BiUZyBXGn%2BwSGXPQNs%2B9y89zIz3QDj%2BrD%2Fi6sUEiE1MVSgB4y%2B51paeiInLFGaAZnhOK2gAIUepxabyeoakbF4E8U5HuBUlwv0hThphU54zaqL9WXCOFCbGP0k6U5hSLDJo%2FscaSIwejgVVcgQ2wqYjzBFeIxuzMJcmlMnub75%2Bq96QnglsT4iZgbphI%2Bv2IG%2FJwKxrePwMpXWufTc4i0qF%2FqXLc66L4pKX82E6LKXAErMkrj%2FZQsKpZu7zHpKybavTlKSondi2S7hn15qmU5T6I%2BpcWcA4u78I5p3y7oyEWxqN9wwhZSMalpG1HVKxG1%2B2sC5%2FJjzprWsqoGUWyuX2r5sKNmstykP9ddCP07CQZB4F7Wr1D8VVYVJd8RSwFapmc8NY4l4qzky5uhlrbY2MnOO5zndxnGvHIfACBh2xJmuvgpnbzsYFgZ59q2IdRBiWd%2FCvB4%2BE6OmqvtIGmXm2VkYkzqsCD1%2B9Y2piQs0Wu0UA3bRQZEQE5giUj3jzqN%2BOWJxaFjqj3C3bAitgWaWNQSxay3yEsj4mNf56szMu8E90MpEUhJIe1T2z1XHq4vPBvYabmtPyNzRrVuZTXhHuWrFYbZN4qX4%2BCMxACAGKcydSJKhkQImIidj4iXcuHoXaQTKCECZ90wvY75zQY6mAHC8pQ123Z899dHcpWN7vX71%2B3loE5SIsJoE9zdiIbFkoJvzUQyYiNIHjx4O4aBa5UJli0IAW9BZTuVTunqeP1wryo%2FiqAWS461v2XoAD9%2FLHFpEnVwvgusmtdxwTgE2qOkT%2Bhys6TICPgU3VCYCDLtgacyYBPIhmBTc8OAgTJ%2BfslMhFCa1xB9e5RpjM%2FOrVENTSE9jAFFWA%3D%3D&Expires=1774079079)]

- Frame: 358×auto, radius 16, white fill, stroke `#E5E7EB`, margin 16.
- Padding 12.

Table showing stack changes:

`textToken | Stack before | Stack after
-----|--------------|------------
8    | []           | [8]
4    | [8]          | [8, 4]
3    | [8, 4]       | [8, 4, 3]
-    | [8, 4, 3]    | [8, 1]
...`

- Highlight current step.
- Final row: `Result: 53`.

---

## 12. Strip – `Quick presets`

Pills for PDF‑style examples.

- Label: `Examples` (12, gray‑600).
- Chips:
    - `Simple: 2+3*4`
    - `Parentheses: (2+3)*4`
    - `PDF example: 8 4 / 3 - 5 * 6 + ...`
    - `Empty stack test`

---

## 13. Bottom row – `Actions`

- Frame: 390×64, white, top radius 24.
- Left: `Clear`.
- Right blue pill: `Copy all steps` (120×40).

---