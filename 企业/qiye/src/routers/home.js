const home = {
	path: '/',
	name: 'index',
	redirect: { name: 'home' },
	component(resolve) {
		require.ensure(['@/components/common/layout'], () => {
			resolve(require('@/components/common/layout'))
		})
	},
	meta: {
		requiresAuth: true
	},
	children:[
		{
			path: 'home',
			name: 'home',
			redirect: { name: 'list' },
			component(resolve) {
				require.ensure(['@/components/home/index'], () => {
					resolve(require('@/components/home/index'))
				})
			},
			meta: {
				title: '首页',
				requiresAuth: true
			}
		},
		{
			path: 'profile/password',
			name: 'password',
			component(resolve) {
				require.ensure(['@/components/profile/password'], () => {
					resolve(require('@/components/profile/password'))
				})
			},
			meta: {
				title: '修改密码',
				requiresAuth: true
			}
		},
		{
			path: '/views/list/list',
			name: 'list',
			component(resolve) {
				require.ensure(['@/views/list/list'], () => {
					resolve(require('@/views/list/list'))
				})
			},
			meta: {
				title: '员工列表',
				requiresAuth: true
			}
		},		
	]
}

export default home