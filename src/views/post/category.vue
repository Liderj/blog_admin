<template>
  <div class="app-container" v-loading="listLoading">
    <div class="header">
      <el-button type="primary" @click="openForm(0)">添加分类</el-button>
    </div>
    <el-table :data="list" border style="width: 50%;margin-top:10px"   >
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column label="操作" width="150">
         <template slot-scope="scope">
               <div v-if="scope.row.id !=1 && scope.row.id!=2">
           <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-start">
              <i class="el-icon-edit action_icon"  @click="openForm(scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-start">
              <i  class="el-icon-delete action_icon"  @click="openPermissionDialog(scope.row.id)"></i>
            </el-tooltip>
               </div>
        </template>
        </el-table-column>
</el-table>


<el-dialog :title="fromTitle" :visible.sync="formDialog" width="30%">
    <el-form label-position='left' label-width="120px" :model="form" v-loading="detailLoading">
        <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="formDialog = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
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
      description="删除此分类将使此分类下所有文章转至无分类下，且不可恢复"
      show-icon
      title="强烈警告"
      :closable="false">
       </el-alert>
      <el-input type="password" v-model="password" placeholder="请输入登录密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteC" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
} from "@/api/post";

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      detailLoading: false,
      form: {
        id: null,
        name: ""
      },
      fromTitle: "",
      formType: 0,
      formDialog: false,
      permissionDialog: false,
      allPermission: [],
      permission: [],
      sourceDate: [],
      password: null,
      btnLoading: false
    };
  },

  mounted() {
    this.getData();
  },
  methods: {
    select() {
      this.permission.forEach(element => {
        let a = this.sourceDate.find(e => e.id == element && e.pid != 0);
        if (a && this.permission.indexOf(a.pid) == -1) {
          this.permission.push(a.pid);
        }
      });
    },
    getData() {
      this.listLoading = true;
      getCategory().then(res => {
        this.listLoading = false;
        this.list = res.data;
      });
    },
    deleteC(id) {
      deleteCategory(this.actionRowId, {
        password: this.password
      }).then(res => {
        if (res.code == 200) {
          this.permissionDialog = !this.permissionDialog;
          this.$notify({
            title: "成功",
            message: res.message,
            type: "success"
          });
          this.getData();
        }
      });
    },
    openForm(type) {
      let self = this;
      this.formType = type;
      this.fromTitle = !!type ? "修改分类" : "添加分类";
      this.formDialog = !this.formDialog;
      this.form = {
        id: null,
        name: ""
      };
      if (!!this.formType) {
        this.form = JSON.parse(JSON.stringify(type));
      }
    },
    submitForm() {
      let postVal = this.form;
      let postReq = !this.formType
        ? createCategory({ name: postVal.name })
        : updateCategory(postVal.id, { name: postVal.name });
      postReq.then(res => {
        if (res.code == 200) {
          this.formDialog = false;
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getData();
        }
      });
    },
    openPermissionDialog(id) {
      this.actionRowId = null;
      this.permissionDialog = !this.permissionDialog;
      this.actionRowId = id;
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
</style>