import Clipboard from 'clipboard';
import Vue from 'vue'

export function copy(e, code) {
    const clipboard = new Clipboard(e.target, {
        // 点击copy按钮，直接通过text直接返回复印的内容
        text: () => code
    });
    clipboard.on('success', () => {
        Vue.prototype.$message.success('复制成功');
        clipboard.off('error');
        clipboard.off('success');
        clipboard.destroy()
    });
    clipboard.on('error', (e) => {
        console.log(e);
        Vue.prototype.$message.warn('该浏览器不支持此方式复制');
        clipboard.off('error');
        clipboard.off('success');
        clipboard.destroy()
    });
    clipboard.onClick(e)
}