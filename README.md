### qn-cli

> a command line tool to operate qiniu cloud object strage

#### Usage

##### `upload`

> 上传文件

```
qn-cli upload assets/** images/*.png --basePath qn-cli/example
```

##### `login`

> 重新设置ak 和 sk

```
qn-cli upload assets/** images/*.png
```

##### `buckets`

> bucket 相关操作

```
qn-cli buckets list # 列出所有的buckets
```

##### `hosts`

> cdn hosts 相关

```
qn-cli hosts [bucket] # 列出某个bucket中的所有映射域名 不输入bucket则会获取到所有的buckets然后选择
```

##### `refresh`

> 刷新资源cache

```
qn-cli refresh
```
##### `objects`

> 存储对象相关

```
qn-cli objects stats # 查看某个存储对象的数据
qn-cli objects move # 移动存储对象
qn-cli objects copy # 复制存储对象
qn-cli objects delete # 删除存储对象
```
