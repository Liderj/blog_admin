<template>
  <div class="app-container">
     <div class="header">
      <el-button type="primary" @click="formDialog = true">添加敏感词</el-button>
    </div>
    <el-table :data="list" border style="width: 50%;margin-top:10px"   >
      <el-table-column prop="id" label="ID" width="80">
      </el-table-column>
      <el-table-column prop="content" label="内容">
      </el-table-column>
      <el-table-column label="操作" width="150">
         <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-start">
              <i  class="el-icon-delete action_icon" @click="deleteK(scope.row.id)" ></i>
            </el-tooltip>
        </template>
        </el-table-column>
</el-table>
<el-dialog title="添加敏感词" :visible.sync="formDialog" width="30%">
    <el-form label-position='left' label-width="120px" :model="form">
        <el-form-item label="内容">
            <el-input v-model="form.content"></el-input>
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
import { getKeywords, addKeywords, deleteKeywords } from "@/api/comment";

export default {
  data() {
    return {
      list: [],
      formDialog: false,
      form: {
        content: ""
      }
    };
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getKeywords().then(res => (this.list = res.data));
    },
    deleteK(id) {
      this.$confirm("确认删除？").then(() => {
        deleteKeywords(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.list.splice(this.list.findIndex(i => i.id == id), 1);
          }
        });
      });
    },
    submitForm() {
      addKeywords({ content: this.form.content }).then(res => {
        if (res.code == 200) {
          this.formDialog = false;
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getData();
        }
      });
    }
  }
};
</script>
<style lang="scss">

</style>