<template>
    <page-layout>
        <a-card title="个人中心" :bordered="false">
            <div class="account-settings-info-view">
                <a-row :gutter="16" type="flex" justify="center">

                    <a-col :md="24" :lg="16" :span="isMobile?24:0" :order="isMobile?3:1">

                        <a-form-model layout="vertical" ref="form" :model="form" :rules="rules">

                            <a-form-model-item label="昵称" prop="username" required>
                                <a-input placeholder="给自己起个名字" disabled v-model="form.username"/>
                            </a-form-model-item>

                            <a-form-model-item label="性别" prop="sex">
                                <a-radio-group v-model="form.sex" default-value="男">
                                    <a-radio value="男">
                                        男
                                    </a-radio>
                                    <a-radio value="女">
                                        女
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>

                            <!--              <a-form-model-item label="年龄" prop="age">-->
                            <!--                <a-input-number v-model="form.age"/>-->
                            <!--              </a-form-model-item>-->

                            <a-form-model-item
                                    label="手机号"
                                    :required="false" prop="phone">
                                <a-input placeholder="exp@admin.com" v-model="form.phone"/>
                            </a-form-model-item>

                            <a-form-model-item
                                    label="电子邮件"
                                    :required="true" prop="email">
                                <a-input placeholder="exp@admin.com" v-model="form.email"/>
                            </a-form-model-item>


                            <a-form-model-item label="个人描述">
                                <a-textarea rows="4" v-model="form.description" placeholder="太懒了，表示一句话都不想说" />
                            </a-form-model-item>


                            <a-form-model-item>
                                <a-button type="primary" @click="save">提交</a-button>
                                <a-button style="margin-left: 8px">保存</a-button>
                            </a-form-model-item>

                        </a-form-model>

                    </a-col>
                    <a-col :md="24" :lg="8" :order="2" :style="{ minHeight: '180px' }">
                        <div class="ant-upload-preview" @click="edit()">
                            <a-icon type="cloud-upload-o" class="upload-icon"/>
                            <div class="mask">
                                <a-icon type="plus"/>
                            </div>
                            <img :src="form.avatar"/>
                        </div>
                    </a-col>

                </a-row>

            </div>

            <a-modal
                    title="修改头像"
                    :visible="visible"
                    :maskClosable="false"
                    :confirmLoading="confirmLoading"
                    :width="800"
                    :footer="null"
                    @cancel="cancelHandel">
                <a-row>
                    <a-col :xs="24" :md="12" :style="{height: '350px'}">
                        <vue-cropper
                                ref="cropper"
                                :img="options.img"
                                :info="true"
                                :autoCrop="options.autoCrop"
                                :autoCropWidth="options.autoCropWidth"
                                :autoCropHeight="options.autoCropHeight"
                                :fixedBox="options.fixedBox"
                                @realTime="realTime"
                        >
                        </vue-cropper>
                    </a-col>
                    <a-col :xs="24" :md="12" :style="{height: '350px'}">
                        <div class="avatar-upload-preview">
                            <img :src="previews.url" :style="previews.img"/>
                        </div>
                    </a-col>
                </a-row>
                <br>
                <a-row>
                    <a-col :lg="2" :md="2">
                        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
                            <a-button icon="upload">选择图片</a-button>
                        </a-upload>
                    </a-col>
                    <a-col :lg="{span: 1, offset: 2}" :md="2">
                        <a-button icon="plus" @click="changeScale(1)"/>
                    </a-col>
                    <a-col :lg="{span: 1, offset: 1}" :md="2">
                        <a-button icon="minus" @click="changeScale(-1)"/>
                    </a-col>
                    <a-col :lg="{span: 1, offset: 1}" :md="2">
                        <a-button icon="undo" @click="rotateLeft"/>
                    </a-col>
                    <a-col :lg="{span: 1, offset: 1}" :md="2">
                        <a-button icon="redo" @click="rotateRight"/>
                    </a-col>
                    <a-col :lg="{span: 2, offset: 6}" :md="2">
                        <a-button type="primary" @click="finish('blob')">保存</a-button>
                    </a-col>
                </a-row>
            </a-modal>
        </a-card>
    </page-layout>
</template>

<script>
    import {mapGetters, mapState} from 'vuex'
    import PageLayout from "@/layouts/PageLayout";
    import {getUserInfo, updateUserInfo, uploadAvatar} from '@/services/user'

    export default {
        name: "Personal",
        computed: {
            ...mapGetters('user', ['user']),
            ...mapState('setting', ['isMobile']),
        },
        components: {PageLayout},
        data() {
            return {
                preview: {},
                option: {
                    img: '/avatar2.jpg',
                    info: true,
                    size: 1,
                    outputType: 'jpeg',
                    canScale: false,
                    autoCrop: true,
                    // 只有自动截图开启 宽度高度才生效
                    autoCropWidth: 180,
                    autoCropHeight: 180,
                    fixedBox: true,
                    // 开启宽度和高度比例
                    fixed: true,
                    fixedNumber: [1, 1]
                },
                visible: false,
                id: null,
                confirmLoading: false,
                fileList: [],
                uploading: false,
                options: {
                    // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                    img: '',
                    autoCrop: true,
                    autoCropWidth: 200,
                    autoCropHeight: 200,
                    fixedBox: true
                },
                previews: {},
                form: {
                    id: null,
                    avatar: null,
                    username: null,
                    age: null,
                    sex: null,
                    email: null,
                    phone: null,
                    description: null,
                },
                rules: {
                    email: {min: 1, trigger: ['change', 'blur'], required: true, message: "请输入邮箱",},
                }
            }
        },
        created() {
            getUserInfo().then(this.afterGetUserInfo)
        },
        methods: {
            save() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        updateUserInfo({
                            "id": this.form.id,
                            "sex": this.form.sex,
                            "age": this.form.age,
                            "avatar": this.form.avatar,
                            "phone": this.form.phone,
                            "email": this.form.email,
                            "description": this.form.description,
                        }).then(res => {
                            if (res.data.data) {
                                this.$message.success('保存成功')
                            }
                        });
                    } else {
                        console.log('error submit!');
                        return false;
                    }
                });
            },
            setavatar(url) {
                this.option.img = url
            },
            afterGetUserInfo(res) {
                if (res.data.code === 200) {
                    this.form = res.data.data
                    console.log(res.data.data);
                    if (res.data.data.avatar == null) {
                        this.form.avatar = require("@/assets/img/avatar.jpg")
                    }
                }
            },
            edit() {
                this.visible = true
            },
            close() {
                this.id = null
                this.visible = false
            },
            cancelHandel() {
                this.close()
            },
            changeScale(num) {
                num = num || 1
                this.$refs.cropper.changeScale(num)
            },
            rotateLeft() {
                this.$refs.cropper.rotateLeft()
            },
            rotateRight() {
                this.$refs.cropper.rotateRight()
            },
            beforeUpload(file) {
                const reader = new FileReader()
                // 把Array Buffer转化为blob 如果是base64不需要
                // 转化为base64
                reader.readAsDataURL(file)
                reader.onload = () => {
                    this.options.img = reader.result
                }
                // 转化为blob
                // reader.readAsArrayBuffer(file)
                return false
            },

            // 上传图片（点击上传按钮）
            finish(type) {
                console.log('finish')
                const _this = this
                const formData = new FormData()
                // 输出
                if (type === 'blob') {
                    this.$refs.cropper.getCropBlob((data) => {
                        const img = window.URL.createObjectURL(data)
                        this.model = true
                        this.modelSrc = img
                        formData.append('file', data, ".jpg")
                        uploadAvatar(formData).then(response => {
                            if (response.data.data) {
                                _this.$message.success('上传成功')
                                this.form.avatar = response.data.data;
                                _this.visible = false
                            }
                        })
                    })
                } else {
                    this.$refs.cropper.getCropData((data) => {
                        this.model = true
                        this.modelSrc = data
                    })
                }
            },
            okHandel() {
                const vm = this
                vm.confirmLoading = true
                setTimeout(() => {
                    vm.confirmLoading = false
                    vm.close()
                    vm.$message.success('上传头像成功')
                }, 2000)
            },

            realTime(data) {
                this.previews = data
            }
        },

    }
</script>


<style lang="less" scoped>

    .avatar-upload-preview {
        position: absolute;
        top: 50%;
        transform: translate(50%, -50%);
        width: 180px;
        height: 180px;
        border-radius: 50%;
        box-shadow: 0 0 4px #ccc;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }
    }


    .avatar-upload-wrapper {
        height: 200px;
        width: 100%;
    }

    .ant-upload-preview {
        position: relative;
        margin: 0 auto;
        width: 100%;
        max-width: 180px;
        border-radius: 50%;
        box-shadow: 0 0 4px #ccc;

        .upload-icon {
            position: absolute;
            top: 0;
            right: 10px;
            font-size: 1.4rem;
            padding: 0.5rem;
            background: rgba(222, 221, 221, 0.7);
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .mask {
            opacity: 0;
            position: absolute;
            background: rgba(0, 0, 0, 0.4);
            cursor: pointer;
            transition: opacity 0.4s;

            &:hover {
                opacity: 1;
            }

            i {
                font-size: 2rem;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -1rem;
                margin-top: -1rem;
                color: #d6d6d6;
            }
        }

        img, .mask {
            width: 100%;
            max-width: 180px;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
        }
    }
</style>
