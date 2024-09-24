export const initialData = `
# Markdown 测试文档

> 引用测试
>
> 引用测试第二段



正文测试

正文测试第二段

**粗体**测试

*斜体*测试

~~删除线~~测试

==highlight==



## 二级标题测试

### 三级标题测试

#### 四级标题测试



表格测试

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |



有序列表测试

1. aksldjfb
2. asdkfjb
3. asdfjb
  1. kjalsdbf
  2. asdfkjb
  3. asdfj
4. kasjdfb
5. asdfjkb
6. asfdj
  1. kjasdfn
  2. asdfjb



无序列表测试

- aaa
- bbb
  - ccc
  - ddd
    - eee
    - fff
  - ggg



图片测试

![test img](https://www.un.org/sustainabledevelopment/wp-content/uploads/sites/6/2018/08/gogoal.jpg)



代码测试

行内\`代码\`测试

\`\`\`javascript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
\`\`\`



链接测试

[Baidu!](https://www.baidu.com/)
`;