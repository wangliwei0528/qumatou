import http from '@/utils/http'

const card = {

	/**
	* 获取我的卡券数据
	* @param {function}		cb					成功回调
	*/
	getCardData(cb) {
		http.get.call(this, 'admin/coupons', cb)
	},

	/**
	* 更新系统设置
	* @param {json}		data					数据
	* @param {function}		cb					成功回调
	*/
	update(data, cb) {
		http.post.call(this, '/setting/update', data, cb)
	}
}

export default card