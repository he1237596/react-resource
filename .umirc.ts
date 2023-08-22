/*
 * @Author: Chris
 * @Date: 2023-07-26 17:22:37
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-22 11:46:51
 * @Descripttion: **
 */
import { defineConfig } from 'dumi';
const root = '/react-resource/'
export default defineConfig({
  base: root,
  publicPath: root,
  hash: true,
  title: 'react-khooks',
  favicon:
    '/ee.jpg',
  logo: '/ee.jpg',
  outputPath: 'docs-dist',
  // more config: https://d.umijs.org/config
});
