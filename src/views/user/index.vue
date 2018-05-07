<template>
  <div class="app-container" v-loading="listLoading">
    <div class="header">
      <el-input style="width:40%" placeholder="搜索手机号或昵称" v-model="search" class="input-with-select">
        <el-select v-model="status" slot="prepend" placeholder="所有用户">
          <el-option label="正常" value="1"></el-option>
          <el-option label="冻结" value="0"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData(1)"></el-button>
      </el-input>
    </div>
    <el-table :data="list" border style="width: 100%;margin-top:10px"  v-loading="listLoading">
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="avatar" label="头像" width="200">
        <template slot-scope="scope">
         <img :src="scope.row.avatar"  class="u-avatar">
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称"  width="280">
      </el-table-column>
      <el-table-column prop="sex" label="性别"  width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.sex ==1">男</span>
          <span v-if="scope.row.sex ==2">女</span>
          <span v-if="scope.row.sex ==3">保密</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="200">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ?'success':'danger'">{{scope.row.status ?'正常':'锁定'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
           <el-tooltip class="item" effect="dark" content="查看详情" placement="bottom-start">
              <i class="el-icon-edit action_icon" @click="showUserDetail(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-start">
              <i  class="el-icon-delete action_icon" @click="openPermissionDialog(scope.row.id)"></i>
            </el-tooltip>
            <el-button :type="scope.row.status ?'danger':'success'" @click="updateStatus(scope.row.id,scope.row.status)"  size="small">{{scope.row.status ?'锁定':'解锁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 15px;"
      background
      layout="prev, pager, next"
      @current-change="getData"
      :total="total">
    </el-pagination>
  <el-dialog
    title="用户详情"
    :visible.sync="formDialog"
    width="30%"
    >
        <el-form label-position='left'  label-width="120px" :model="form" v-loading="detailLoading" >
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-button   @click="passwordInput =!passwordInput" type="password" size="small">{{passwordInput?'取消修改':'修改密码'}}</el-button>
        <el-input
          v-if = "passwordInput"
          placeholder="请输入密码"
          v-model="form.password"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="头像">
             <img :src="form.avatar" alt="" class="avatar">
      </el-form-item>
      <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="3">保密</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="类型">
               <el-radio-group v-model="form.type" disabled>
            <el-radio :label="1">普通用户</el-radio>
            <el-radio :label="0">管理用户</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="角色">
         <el-select v-model="form.roles" filterable  disabled  placeholder="请选择">
            <el-option
              v-for="item in allRoles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
         >
        </el-switch>
       
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="formDialog = false">取 消</el-button>
      <el-button type="primary" @click="updateUser(form.id)">确 定</el-button>
    </span>
  </el-dialog>


   <!-- 密码验证弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="permissionDialog"
      width="40%"
      >
      <el-alert
      style="margin:10px 0"
      type="warning"
      description="删除此用户将删除用户所有数据且无法恢复"
      show-icon
      title="强烈警告"
      :closable="false">
       </el-alert>
      <el-input type="password" v-model="verifyPassword" placeholder="请输入登录密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteU" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllUser,
  getUser,
  deleteUser,
  disableUser,
  updateUserDetail
} from "@/api/user";
import { allRoles } from "@/api/roles";

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      detailLoading: false,
      type: "",
      status: null,
      search: "",
      total: 0,
      formDialog: false,
      allRoles: [],
      passwordInput: false,
      form: {
        id: null,
        avatar: "",
        nickname: "",
        mobile: "",
        roles: 2,
        sex: 1,
        status: true,
        type: 1,
        password: ""
      },
      permissionDialog: false,
      verifyPassword: "",
      deleteID: null,
      btnLoading: false
    };
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData(page) {
      this.listLoading = true;
      getAllUser({
        search: this.search,
        type: 1,
        status: this.status,
        page: page
      }).then(res => {
        this.listLoading = false;
        if (!res.data.list) {
          this.$message({
            message: "未搜索到相关用户",
            type: "warning"
          });
          return;
        }
        res.data.list.forEach(element => {
          element.status == 1
            ? (element.status = true)
            : (element.status = false);
          element.status == 1;
        });
        this.list = res.data.list;
        this.total = res.data.count;
      });
    },
    showUserDetail(id) {
      this.formDialog = true;
      this.detailLoading = true;
      this.passwordInput = false;
      allRoles().then(res => {
        this.allRoles = res.data;
      });
      getUser(id).then(res => {
        this.formDialog = false;
        this.form = res.data;
        this.form.roles = res.data.roles.id;
        this.form.status = res.data.status ? true : false;
        // this.detailLoading = false;
      });
    },
    updateUser(id) {
      let req = {
        nickname: this.form.nickname,
        sex: this.form.sex,
        status: this.form.status ? 1 : 0
      };
      if (this.passwordInput && this.form.password) {
        req.password = this.form.password;
      }
      updateUserDetail(id, req).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.formDialog = false;
          this.getData();
        }
      });
    },
    openPermissionDialog(id) {
      this.deleteID = null;
      this.permissionDialog = !this.permissionDialog;
      this.deleteID = id;
    },
    deleteU() {
      this.btnLoading = true;
      deleteUser(this.deleteID, { password: this.verifyPassword }).then(res => {
        this.btnLoading = false;
        if (res.code == 200) {
          this.permissionDialog = !this.permissionDialog;
          this.$notify({
            title: "成功",
            message: res.message,
            type: "success"
          });
        }
        this.getData();
      });
    },
    updateStatus(id, staus) {
      this.$confirm(
        `此操作将 ${staus ? "使用户无法登录" : "解锁该用户账号"}, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        disableUser(id).then(res => {
          loading.close();
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: res.message,
              type: "success"
            });
            this.list.find(e => e.id == id).status = !staus;
          }
        });
      });
    }
  }
};
</script>
<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.action_icon {
  font-size: 20px;
  cursor: pointer;
  margin-right: 10px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.u-avatar {
  width: 80px;
  height: 80px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
