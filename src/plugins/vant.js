// 按需全局引入 vant组件
import Vue from 'vue'
import { Button, List, Cell, Tabbar, TabbarItem, Popover } from 'vant'
Vue.use(Button)
  .use(Cell)
  .use(List)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Popover);
