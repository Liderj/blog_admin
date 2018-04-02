<template>
  <div class="app-container">

    <div class="comment">
      <div class="header">
        <el-input style="width:40%" placeholder="搜索评论" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-table :data="commentList" border style="width:100%" v-loading="listLoading">
        <el-table-column prop="id" label="ID" width="80">
        </el-table-column>
        <el-table-column prop="post.title" label="评论的博客">
        </el-table-column>
        <el-table-column prop="user.nickname" label="评论者">
        </el-table-column>
        <el-table-column prop="content" label="评论内容">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark"  content="查看回复" placement="bottom-start">
              <i class="el-icon-view action_icon" @click="reply(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-start">
              <i class="el-icon-delete action_icon" @click="deleteC(scope.row.id)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 15px;" background layout="prev, pager, next" @current-change="getComment" :total="commentTotal">
      </el-pagination>
    </div>
    <div class="reply" v-if="showReply">
      <div class="header">
        <el-input style="width:40%" placeholder="搜索回复" v-model="searchReply" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-table :data="replyList" border style="width:100%" v-loading="replyLoading">
        <el-table-column prop="id" label="ID" width="80">
        </el-table-column>
        <el-table-column prop="user" label="回复者">
        </el-table-column>
        <el-table-column prop="content" label="评论内容">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-start">
              <i class="el-icon-delete action_icon" @click="deleteR(scope.row.id)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 15px;" background layout="prev, pager, next" @current-change="replyPagination" :total="replyTotal">
      </el-pagination>
     
    </div>
  </div>
</template>

<script>
import {
  getAllComment,
  deleteComment,
  getAllReply,
  deleteReply
} from "@/api/comment";

export default {
  data() {
    return {
      commentList: [],
      listLoading: false,
      showReply: false,
      search: "",
      commentTotal: 0,
      replyLoading: false,
      searchReply: "",
      replyList: [],
      replyTotal: 0,
      cid: null
    };
  },

  mounted() {
    this.getComment(1);
  },
  methods: {
    getComment(page) {
      this.listLoading = true;
      this.showReply = false;
      this.cid = null;
      getAllComment({
        search: this.search,
        page: page
      }).then(res => {
        this.listLoading = false;
        if (!res.data.list) {
          this.$message({
            message: "未搜索到相关评论",
            type: "warning"
          });
          return;
        }

        this.commentList = res.data.list;
        this.commentTotal = res.data.count;
      });
    },
    deleteC(id) {
      this.$confirm("确认删除？").then(() => {
        deleteComment(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.showReply = false;
            this.commentList.splice(
              this.commentList.findIndex(i => i.id == id),
              1
            );
          }
        });
      });
    },
    reply(id) {
      this.showReply = true;
      this.replyLoading = true;
      this.cid = id;
      getAllReply({
        search: this.search,
        page: 1,
        cid: this.cid
      }).then(res => {
        this.replyLoading = false;
        if (!res.data.list) {
          this.$message({
            message: "未找到相关回复",
            type: "warning"
          });
        }
        this.replyList = res.data.list;
        this.replyTotal = res.data.count;
      });
    },
    replyPagination(page) {
      this.replyLoading = true;
      getAllReply({
        search: this.search,
        page: page,
        cid: this.cid
      }).then(res => {
        this.replyLoading = false;
        this.replyList = res.data.list;
        this.replyTotal = res.data.count;
      });
    },
    deleteR(id) {
      this.$confirm("确认删除？").then(() => {
        deleteReply(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.replyList.splice(this.replyList.findIndex(i => i.id == id), 1);
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  display: flex;
  justify-content: space-between;
  .comment,
  .reply {
    width: 45%;
    position: relative;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}

.action_icon {
  font-size: 20px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
