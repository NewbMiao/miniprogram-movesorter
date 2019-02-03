Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },
    packup: {
      type: Boolean,
      value: true
    },
  },
  data: {
    // 这里是一些组件内部数据
    movingUrl: '',
    hidden: true,
    flag: false,
    x: 0,
    y: 0,
    disabled: true,
    elements: []
  },
  methods: {

    scrollPhoto: function() {
      let that = this
      var query = that.createSelectorQuery();
      var nodesRef = query.selectAll(".pop_view .item");
      nodesRef.fields({
        dataset: true,
        rect: true,
      }, (result) => {
        that.setData({
          elements: result
        })
      }).exec()
    },
    //长按
    _longtap: function(e) {
      const url = e.currentTarget.dataset.url;
      this.setData({
        movingUrl: url,
        x: e.currentTarget.offsetLeft,
        y: e.currentTarget.offsetTop,
        hidden: false,
        flag: true
      })
    },
    //触摸开始
    touchs: function(e) {
      this.scrollPhoto()

      this.setData({
        beginIndex: e.currentTarget.dataset.index
      })

    },
    //触摸结束
    touchend: function(e) {
      let that = this,
        elements = that.data.elements
      if (!this.data.flag) {
        return;
      }
      const x = e.changedTouches[0].pageX
      const y = e.changedTouches[0].pageY
      let data = that.data.list
      for (var j = 0; j < elements.length; j++) {
        const item = elements[j];
        if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
          const endIndex = item.dataset.index;
          const beginIndex = that.data.beginIndex;
          //向后移动
          if (beginIndex < endIndex) {
            let tem = data[beginIndex];
            for (let i = beginIndex; i < endIndex; i++) {
              data[i] = data[i + 1]
            }
            data[endIndex] = tem;
          }
          //向前移动
          if (beginIndex > endIndex) {
            let tem = data[beginIndex];
            for (let i = beginIndex; i > endIndex; i--) {
              data[i] = data[i - 1]
            }
            data[endIndex] = tem;
          }
        }
      }
      that.setData({
        movingUrl: '',
        hidden: true,
        flag: false
      })
      that.triggerEvent('sorted', {
        list: data
      })

    },
    //滑动
    touchm: function(e) {
      if (this.data.flag) {
        const x = e.touches[0].pageX
        const y = e.touches[0].pageY
        this.setData({
          x: x - 75,
          y: y - 45
        })
      }
    },
    packUpToggle: function() {
      let tmp = !this.data.packup
      this.triggerEvent('packup', {
        packup: tmp
      })
      this.setData({
        packup: tmp
      })
    },
    rmImg: function(e) {
      let that = this
      wx.showModal({
        title: '移除确认',
        content: '确认移除此照片？',
        success: function(res) {
          if (res.confirm) {
            let tmp = that.data.list
            tmp.splice(e.currentTarget.dataset.index, 1)
            that.triggerEvent('sorted', {
              list: tmp
            })
          }
        }
      })
    }

  }
})