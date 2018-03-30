<template>
  <div class="app-container" v-loading="listLoading">
    <div class="header">
      <el-input style="width:40%" placeholder="请输入权限名称" v-model="search" class="input-with-select">
        <el-select v-model="type" slot="prepend" placeholder="所有权限">
          <el-option label="接口权限" value="1"></el-option>
          <el-option label="页面权限" value="0"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getData(search,type)"></el-button>
      </el-input>
      <el-button type="primary" @click="openForm(0)">添加权限</el-button>
    </div>
    <el-table :data="list" border style="width: 100%;margin-top:10px"   >
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="280">
      </el-table-column>
      <el-table-column prop="url" label="api或者路由">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 0?'danger':'success'">{{scope.row.status == 0?'关闭':'开启'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="权限类型" width="100">
        <template slot-scope="scope">
          {{scope.row.type == 0?'页面':'接口'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
           <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-start">
              <i class="el-icon-edit action_icon" @click="openForm(scope.row.id,scope.row.pid)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-start">
              <i  class="el-icon-delete action_icon"  @click="openPermissionDialo(scope.row.id)"></i>
            </el-tooltip>
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

    <!-- 密码验证弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="permissionDialog"
      width="40%"
      >
      <el-alert
      style="margin:10px 0"
      type="warning"
      description="如果此全权限是页面权限，将删除其下所有接口权限，请谨慎操作"
      show-icon
      title="强烈警告"
      :closable="false">
       </el-alert>
      <el-input type="password" v-model="password" placeholder="请输入登录密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialog = false">取 消</el-button>
        <el-button type="primary" @click="deletePer">确 定</el-button>
      </span>
    </el-dialog>

<!-- 添加删除弹窗 -->
  <el-dialog
    :title="fromTitle"
    :visible.sync="formDialog"
    width="30%"
    >
        <el-form label-position='left'  label-width="120px" :model="form"  v-loading="detailLoading">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio v-model="form.type" label="0">页面权限</el-radio>
        <el-radio v-model="form.type" label="1">接口权限</el-radio>
      </el-form-item>
      <el-form-item label="父权限">
         <el-select v-model="form.pid" filterable  :disabled="form.pid =='0' && !!formType"  placeholder="请选择">
            <el-option label="顶级" value="0" >
            </el-option>
            <el-option
              v-for="item in allPer"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="页面url或者api">
        <el-input v-model="form.url"></el-input>
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
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
import { getList, deletePermission, getPermission } from "@/api/permission";
import request from "@/utils/request";

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      detailLoading: false,
      type: "",
      search: "",
      total: 0,
      actionRowId: null,
      permissionDialog: false,
      password: "",
      form: {
        name: "",
        type: "0",
        pid: "0",
        url: "",
        status: true
      },
      fromTitle: "添加权限",
      formType: 0,
      formDialog: false,
      allPer: []
    };
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData(page) {
      this.listLoading = true;
      getList({
        search: this.search,
        type: this.type,
        page: page
      }).then(res => {
        this.listLoading = false;
        if (!res.data.list) {
          this.$message({
            message: "未搜索到此权限",
            type: "warning"
          });
          return;
        }
        res.data.list.forEach(element => {
          element.status == 1
            ? (element.status = true)
            : (element.status = false);
        });
        this.list = res.data.list;
        this.total = res.data.count;
      });
    },
    openPermissionDialo(id) {
      this.actionRowId = null;
      this.permissionDialog = !this.permissionDialog;
      this.actionRowId = id;
    },
    deletePer() {
      deletePermission(this.actionRowId, {
        password: this.password
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.$router.go(0);
        }
        this.permissionDialog = !this.permissionDialog;
      });
    },
    openForm(type, pid) {
      let self = this;
      this.formType = type;
      this.fromTitle = !!type ? "修改权限" : "添加权限";
      this.formDialog = !this.formDialog;
      this.form = {
        name: "",
        type: "0",
        pid: "0",
        url: "",
        status: true
      };
      getList({
        page_size: 200,
        type: 0,
        pid: 0
      }).then(res => {
        this.allPer = res.data.list;
        this.allPer.forEach(element => {
          element.status = element.status == 1 ? true : false;
          element.type = element.type + "";
          element.pid = element.pid + "";
          element.id = element.id + "";
          element.name = element.name;
          element.url = element.url;
        });
      });
      if (!!this.formType) {
        this.detailLoading = true;
        getPermission(this.formType).then(res => {
          if (res.code == 200) {
            self.form.status = res.data.status == 1 ? true : false;
            self.form.type = res.data.type + "";
            self.form.pid = res.data.pid + "";
            self.form.name = res.data.name;
            self.form.url = res.data.url;
            this.detailLoading = false;
          }
        });
      }
    },
    submitForm() {
      let postUrl = !this.formType
        ? "/api/permission"
        : `/api/permission/${this.formType}/update`;
      let postVal = this.form;
      postVal.status = postVal.status ? 1 : 0;
      request.post(postUrl, postVal).then(res => {
        if (res.code != 400) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.$router.go(0);
        }
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
</style>
