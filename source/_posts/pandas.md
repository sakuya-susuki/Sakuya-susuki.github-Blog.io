---
title: Pandas 学习 （How use Pandas）【未完成，需修正】
tags:
  - 教学
  - 技术
---
# English
Hello everyone. This is  Blog  of Anemone. There day we try study liter knowledge of Pandas.
## what is Pandas🤨🐼
~~Pandas is a cute animal in China.~~
"I know that if you're reading this, you (already) know what pandas is. It's a Python package."  of course I need introduce it to accidental  reader.

______


"Pandas" is a data processing package. Many coders use it almost every day in their work and life. Its full name is "Python Data Analysis Library"—yes, it's very long. But the key is just three words: "Python, data, and analysis."
It helps us analyze huge amounts of data and obtain scientific, reasonable results quickly. No matter who you are, once you start using Pandas, it will completely change the way you work with data.
___

## How to install Pandas 0.O
1. You need a install python a computer.(If you unknow how down low python on your computer. you can touch it. www.aaa)
2. In 'CMD' or terminal enter （if your computer use GUN/Linux you need install "pip"）
```
pip install pandas
```
3.  Wait it install over. don't worry is more quick. 
(In not network problems.it will very quick)
4. Use it in your IDE.
## How to use it
If you want to see videos, you can touch it.
'www.aaa'
In this article, I will use "VS Code"  as an example.
**Let's go.**


**LOOK ME**
***I will use "Add Delete lookup change" Four rule write

---

### Add.

Welcome to module one 'Add'. This module  i will teach you how can do data add in Pandas.

1.  Began：
In use Pandas  well  import  it in python.(of course, we will import pack)
(NumPy is a  about math package.)
```
import pandas as pd
import numpy as np
```
2. Add  your doc.
```
data = pd.DataFrame(

    pd.read_csv(r'your_file_path\your_file_name.csv',encoding='utf-8')

)
```
Enter its, your doc will become a Data-Frame object. Now we are dealing with a Pandas Data-Frame object. 
'encoding='utf-8' rule your doc from is 'utf-8'

you can try your code and see. 
Enter it
```
data.iloc[0, 1]
```

If it run  no warm congrats to you.  You get it.


