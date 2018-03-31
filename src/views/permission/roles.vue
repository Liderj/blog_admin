<template>
  <div class="app-container" v-loading="listLoading">
    <div class="header">
      <el-button type="primary" @click="openForm(0)">添加角色</el-button>
    </div>
    <el-table :data="list" border style="width: 50%;margin-top:10px"   >
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 0?'danger':'success'">{{scope.row.status == 0?'关闭':'开启'}}</el-tag>
        </template>
</el-table-column>
<el-table-column label="操作" width="150">
    <template slot-scope="scope">
           <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-start">
              <i class="el-icon-edit action_icon" @click="openForm(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip v-if="scope.row.id!=1 && scope.row.id!=2" class="item" effect="dark" content="删除" placement="bottom-start">
              <i  class="el-icon-delete action_icon"  @click="deleteRole(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip  v-if="scope.row.id!=1" class="item" effect="dark" content="分配权限" placement="bottom-start">
              <i  class="el-icon-setting action_icon" @click="openPermission(scope.row.id)" ></i>
            </el-tooltip>
        </template>
</el-table-column>
</el-table>


<!-- 删除弹窗 -->
<el-dialog :title="fromTitle" :visible.sync="formDialog" width="30%">
    <el-form label-position='left' label-width="120px" :model="form" v-loading="detailLoading">
        <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
            <el-switch v-model="form.status" :disabled="formType == 1 ||formType == 2">
            </el-switch>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="formDialog = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
</el-dialog>


<!-- 权限分配 -->
<el-dialog title="分配权限" :visible.sync="permissionDialog" width="40%">
    <el-form label-position='left' label-width="120px"  v-loading="detailLoading">
       <el-checkbox-group v-model="permission" @change="select" border>
         <div style="padding:10px 10px 0" v-for="item in allPermission" :key="item.id">
            <el-checkbox :label="item.id"  > {{item.name}}</el-checkbox>
            <div v-if="item.child" style="margin:10px 10px 0">
                <el-checkbox  size="medium" v-for="i in item.child" :key="i.id" :label="i.id" border> {{i.name}}</el-checkbox>
            </div>
         </div>
        </el-checkbox-group>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="permissionDialog = false">取 消</el-button>
      <el-button type="primary" @click="submitPermission">确 定</el-button>
    </span>
</el-dialog>
</div>
</template>

<script>
import { allRoles, getRole, deleteRole, updatePermission } from "@/api/roles";
import { getList } from "@/api/permission";
import request from "@/utils/request";

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      detailLoading: false,
      form: {
        name: "",
        status: true
      },
      fromTitle: "",
      formType: 0,
      formDialog: false,
      permissionDialog: false,
      allPermission: [],
      permission: [],
      sourceDate: []
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
    getData(search, type) {
      this.listLoading = true;
      allRoles().then(res => {
        this.listLoading = false;
        res.data.forEach(element => {
          element.status == 1
            ? (element.status = true)
            : (element.status = false);
        });
        this.list = res.data;
      });
    },
    deleteRole(id) {
      this.$confirm("确认删除？").then(() => {
        deleteRole(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getData();
          }
        });
      });
    },
    openForm(type) {
      let self = this;
      this.formType = type;
      this.fromTitle = !!type ? "修改角色" : "添加角色";
      this.formDialog = !this.formDialog;
      this.form = {
        name: "",
        status: true
      };
      if (!!this.formType) {
        this.detailLoading = true;
        getRole(this.formType).then(res => {
          if (res.code == 200) {
            self.form.status = res.data.status == 1 ? true : false;
            self.form.name = res.data.name;
            this.detailLoading = false;
          }
        });
      }
    },
    submitForm() {
      let postUrl = !this.formType
        ? "/api/roles/create"
        : `/api/roles/${this.formType}/update`;
      let postVal = this.form;
      postVal.status = postVal.status ? 1 : 0;
      request.post(postUrl, postVal).then(res => {
        if (res.code != 400) {
          this.formDialog = false;
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getData();
        }
      });
    },
    openPermission(id) {
      this.permissionDialog = true;
      this.allPermission = [];
      this.formType = id;
      this.permission = [];
      getList({ page_size: 200 }).then(res => {
        this.sourceDate = res.data.list;
        res.data.list.forEach(element => {
          if (element.pid == 0) {
            this.allPermission.push(element);
          }
        });
        this.allPermission.forEach(e => {
          res.data.list.forEach(element => {
            if (element.pid != 0 && element.pid == e.id) {
              if (e.child) {
                e.child.push(element);
              } else {
                e.child = [];
                e.child.push(element);
              }
            }
          });
        });
      });
      getRole(this.formType).then(res => {
        if (res.code == 200 && res.data.permission_list) {
          res.data.permission_list.forEach(element => {
            this.permission.push(element.id);
            if (element.child) {
              element.child.forEach(i => {
                this.permission.push(i.id);
              });
            }
          });
        }
      });
    },
    submitPermission() {
      updatePermission(this.formType, {
        permissionId: this.permission
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.permissionDialog = false;
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
</style>