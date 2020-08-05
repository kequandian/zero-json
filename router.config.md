module.exports = [
  {
    name: '测试管理',   //一级菜单名
    path: '/tests',    //父菜单目录路径
    items: [
      {
        name: '测试列表1',      //二级菜单名
        path: '/tests/test1',  //子菜单目录路径
      },
      {
        name: '测试列表2',      //二级菜单名
        path: '/tests/test2',  //子菜单目录路径    
      },
    ],
  },
  /*{
    name: '一级菜单',
    path: '/b',
    items: [
      {
        path: '/b/c',
        name: '二级菜单',
      },
    ],
  },*/
]