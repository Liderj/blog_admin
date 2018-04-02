<template>
  <div class="app-container" >
      <el-table :data="list" border style="width: 100%;margin-top:10px"  v-loading="listLoading">
      <el-table-column prop="id" label="ID" width="100">
      </el-table-column>
      <el-table-column prop="user" label="发布者" width="150">
      </el-table-column>
      <el-table-column prop="title" label="标题/内容">
      </el-table-column>
      <el-table-column prop="likes" label="点赞数"  width="100">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ?'success':'danger'">{{scope.row.status ?'正常':'锁定'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_hot" label="热推" width="100" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_hot ?'success':'danger'">{{scope.row.is_hot ?'是':'否'}}</el-tag>
        </template>
      </el-table-column>
       <el-table-column prop="is_comment" label="是否允许评论" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_comment ?'success':'danger'">{{scope.row.is_comment ?'允许':'不允许'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="发布时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="400">
         <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看详情" placement="bottom-start">
              <i class="el-icon-view action_icon" @click="openDialog(scope.row.id)"></i>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="删除" placement="bottom-start">
              <i  class="el-icon-delete action_icon" @click="_deletePost(scope.row.id)" ></i>
            </el-tooltip>
            <el-button :type="scope.row.status ?'danger':'success'"  size="small" @click="_disablePost(scope.row)">{{scope.row.status ?'关闭':'开启'}}</el-button>
            <el-button :type="scope.row.is_hot ?'danger':'success'"  size="small"  @click="_toggleHot(scope.row)">{{scope.row.is_hot ?'取消推荐':'推荐'}}</el-button>
            <el-button :type="scope.row.is_comment ?'danger':'success'"  size="small"   @click="_toggleComment(scope.row)">{{scope.row.is_comment ?'关闭评论':'开启评论'}}</el-button>
           </template>
      </el-table-column>
    </el-table>

    <el-dialog
  :title="post.cid !=2?post.title:'微博'"
  :visible.sync="postDialogVisible"
  width="50%"
  center>
  <div class="content"  v-loading="detailLoading">
      <div class="author">
         <img :src="post.author.avatar" >
       <span v-text="post.author.nickname"></span> 
       <span>发布时间:{{post.created_at}}</span> 
       <el-tag :type="post.cid ==1?'info':'success'">{{post.category}}</el-tag>
       <span>点赞数:{{post.likes}}</span> 
         <img src="../../../static/img/hot_light.png" style="width:18px"  v-if="post.is_hot">
      </div>
      <div class="post_img">
        <span>配图:</span>
        <div class="img_list"  v-if="post.img">
          <el-carousel trigger="click" >
            <el-carousel-item  v-for="(item,index) in post.img" :key="index">
              <a :href="item" target="_blank">
                <img :src="item"  >
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
        <span v-else>无</span>
      </div>
      <div class="post_content" v-html="post.cid !=2?post.content:post.title"></div>
  </div>
</el-dialog>
  </div>
</template>

<script>
import {
  getCategory,
  getTop,
  getPost,
  deletePost,
  disablePost
} from "@/api/post";
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      detailLoading: false,
      type: null,
      status: null,
      search: "",
      total: 0,
      allCategory: [],
      post: {
        author: {
          avatar: "",
          nickname: ""
        },
        category: "",
        content: null,
        created_at: null,
        id: null,
        img: [],
        is_comment: 1,
        is_hot: 0,
        likes: 0,
        status: 1,
        title: ""
      },
      postDialogVisible: false
    };
  },
  mounted() {
    getCategory().then(res => (this.allCategory = res.data));
    this.getData(1);
  },
  methods: {
    getData(page) {
      getTop().then(res => {
        this.list = res.data;
        this.list.sort((a, b) => b - a);
      });
    },
    _disablePost(post) {
      disablePost(post.id).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: res.message,
            type: "success"
          });
          this.list.find(e => e.id == post.id).status = !post.status;
          if (!post.status) {
            this.list.find(e => e.id == post.id).is_comment = !post.is_comment;
          }
        }
      });
    },
    _toggleComment(post) {
      toggleComment(post.id).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: res.message,
            type: "success"
          });
          this.list.find(e => e.id == post.id).is_comment = !post.is_comment;
        }
      });
    },
    _toggleHot(post) {
      toggleHot(post.id).then(res => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: res.message,
            type: "success"
          });
          this.list.find(e => e.id == post.id).is_hot = !post.is_hot;
        }
      });
    },
    _deletePost(id) {
      this.$confirm("确认删除？").then(() => {
        deletePost(id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.list = this.list.splice(
              this.list.findIndex(i => i.id == 5) + 1,
              1
            );
          }
        });
      });
    },
    openDialog(id) {
      this.postDialogVisible = !this.postDialogVisible;
      this.detailLoading = true;
      getPost(id).then(res => {
        this.detailLoading = false;
        if (res.code == 200) {
          this.post = res.data;
          if (res.data.img) {
            this.post.img = res.data.img.split(",");
          }
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
.content {
  font-size: 14px;
  .author {
    display: flex;
    align-items: center;
    span {
      margin-right: 20px;
    }
  }
  .post_content {
    margin-top: 20px;
  }
  .post_img {
    margin-top: 20px;
    img {
      width: 100%;
    }
  }
}
</style>
