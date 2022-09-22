import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from 'path';

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), '.', dir);
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: pathResolve('src'), // 这里是将src目录配置别名为 @ 方便在项目中导入src目录下的文件
      },
      {
        find: '#',
        replacement: pathResolve('types'),
      },
      {
        find: '@components',
        replacement: pathResolve('src/components'),
      },
    ],
  },
  	build: {
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true, //发布时删除 console
			},
		},
	}, 
});
