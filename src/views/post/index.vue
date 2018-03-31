<template>
  <div class="app-container" >
    <div class="header">
      <el-input style="width:40%" placeholder="搜索文章标题" v-model="search" class="input-with-select">
          <el-select v-model="status" slot="prepend" placeholder="所有文章">
            <el-option label="正常" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
          <el-select style="margin-left:50px" v-model="type" slot="prepend" placeholder="所有分类">
            <el-option v-for="item in allCategory" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getData(1)"></el-button>
        </el-input>
    </div>
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
      <el-table-column prop="is_hot" label="热推" width="100">
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
              <i class="el-icon-view action_icon"></i>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" content="删除" placement="bottom-start">
              <i  class="el-icon-delete action_icon" ></i>
            </el-tooltip>
            <el-button :type="scope.row.status ?'danger':'success'"  size="small" @click="_disablePost(scope.row)">{{scope.row.status ?'关闭':'开启'}}</el-button>
            <el-button :type="scope.row.is_hot ?'danger':'success'"  size="small"  @click="_toggleHot(scope.row)">{{scope.row.is_hot ?'取消推荐':'推荐'}}</el-button>
            <el-button :type="scope.row.is_comment ?'danger':'success'"  size="small"   @click="_toggleComment(scope.row)">{{scope.row.is_comment ?'关闭评论':'开启评论'}}</el-button>
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
  
  </div>
</template>

<script>
import {
  getCategory,
  getAllPost,
  getPost,
  deletePost,
  toggleHot,
  toggleComment,
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
      allCategory: []
    };
  },
  mounted() {
    getCategory().then(res => (this.allCategory = res.data));
    this.getData(1);
  },
  methods: {
    getData(page) {
      getAllPost({
        page: page,
        search: this.search,
        status: this.status,
        type: this.type
      }).then(res => {
        this.list = res.data.list;
        this.total = res.data.count;
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
