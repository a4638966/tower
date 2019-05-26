var Resource = function () {
    this._urls = {};
    this._controls = {
            uploadDate: $('#uploadDate'),
            btnChart: $('#btnChart'),
            btnTable: $('#btnTable'),
            myChart: $('#myChart'),
            myTable: $('#myTable'),
            _layuiTag: $('.layui-tag')
        },
        this._commonData = {
            chartType: false
        }
}
Resource.prototype.initControl = function () {
    var that = this;
    // 初始化日期
    this.initUpdate();
    layui.use(['tree', 'element'], function () {
        var element = layui.element;
        // layui.tree({
        //   elem: '#treeNav',
        //   skin: 'shihuang',
        //   nodes: [{ //节点
        //     name: '河南省',
        //     spread: true,
        //     children: [{
        //       name: '郑州市',
        //       spread: true,
        //       children: [{
        //           name: '二七区'
        //         },
        //         {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }
        //       ]
        //     }, {
        //       name: '洛阳',
        //       children: [{
        //           name: '二七区'
        //         },
        //         {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }
        //       ]
        //     }, {
        //       name: '新乡',
        //       children: [{
        //           name: '二七区'
        //         },
        //         {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }, {
        //           name: '二七区'
        //         }
        //       ]
        //     }]
        //   }]
        // });
    });

    // 初始化地图
    this.initChart();
    // 按钮事件
    this._controls.btnChart.on('click', function () {
        that._controls.myChart.show();
        that._controls.myTable.hide();
        $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnTable.addClass('layui-btn-primary').removeClass('layui-btn-normal');
        setTimeout(function () {
            that._commonData.chartType = true;
            that.initChart.getBoundary;
        }, 100);
    });
    that._controls.btnTable.on('click', function () {
        that._controls.myChart.hide();
        that._controls.myTable.show();
        $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnChart.removeClass('layui-btn-normal').addClass('layui-btn-primary');
    });

    this._controls._layuiTag.on('click', function () {
        var data_info = $(this).attr('data-info');
        window.location.href = 'resource1.html?dataInfo=' + data_info + '';
    });
};
// 初始化日期
Resource.prototype.initUpdate = function () {
    var that = this;

    function add(m) {
        return m < 10 ? '0' + m : m
    }

    function fortime(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        return (y + '-' + add(m) + '-' + add(d) + ' ' + add(h) + ':' + add(mm) + ':' + add(s));
    }

    var date = new Date(new Date().getTime()); //+ (1000 * 60 * 60 * 72));
    var date_str = fortime(date);
    that._controls.uploadDate.html(date_str)
};
Resource.prototype.initChart = function () {
    var that = this;
    // 获取地图数据
    // 需要引入api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js
    // 创建百度地图map实例
    var map = new BMap.Map("myChart");
    // 初始化地图，设置中心点坐标和地图级别
    map.centerAndZoom(new BMap.Point(113.557234, 33.902115), 8);
    // 设置地图显示的城市，这项是必须的
    map.setCurrentCity("郑州");
    // 开启滚轮缩放
    map.enableScrollWheelZoom(true);
    // 声明一个数组，装行政区域的数据
    var blist = [];
    // 设置一个计数器，用来判断什么时候加载完成行政区域，然后画图
    var districtLoading = 0;
    // 添加行政区划
    function getBoundary() {
        // 计数器来控制加载过程
        districtLoading++;
        // 创建行政区划的对象实例
        var bdary = new BMap.Boundary();
        // 获取行政区域
        bdary.get("河南省", function (rs) {
            // 清除地图覆盖物
            // map.clearOverlays();
            // 行政区域的点有多少个
            var count = rs.boundaries.length;
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                blist.push({
                    points: rs.boundaries[i],
                    name: '河南'
                })
            }
            // 调整视野
            // map.setViewport(pointArray);
            // 执行完成后计数器 -1；
            districtLoading--;
            if (districtLoading === 0) {
                // 画多边形来框选地图范围（边界）
                drawBoundary();
            }
        });
    }

    function drawBoundary() {
        var bdary = new BMap.Boundary();
        bdary.get("河南省", function (rs) { //获取行政区域     
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            var pointArray = [];
            if (that._commonData.chartType === false) {
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeWeight: 2,
                        strokeColor: "#2174ee",
                        fillOpacity: 0.07,
                        fillColor: '#2174ee'
                    }); //建立多边形覆盖物
                    map.addOverlay(ply); //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                }
            }
            map.setViewport(pointArray); //调整视野  
        });
    }
    // 使用添加点的方法
    addPoint();
    // 添加坐标点
    function addPoint() {
        // 生成坐标点
        // 我这里是随机取了河南省的几个坐标，用来添加坐标点
        var positionArray = [
            [114.385112, 36.104493],
            [114.311523, 35.775339],
            [115.01062, 35.805319],
            [113.906782, 35.354419],
            [113.226082, 35.248841],
            [113.64922, 34.779614],
            [114.311523, 34.825142],
            [112.453396, 34.642879],
            [111.20238, 34.809969],
            [115.654526, 34.44497],
            [113.833193, 34.093663],
            [113.189288, 33.786977],
            [114.017166, 33.617825],
            [114.679469, 33.679373],
            [114.035563, 33.046399],
            [112.508588, 32.999902],
            [114.072358, 32.174383]
        ]
        for (var i = 0; i < positionArray.length; i++) {
            // 一个坐标对应一个mark的生成
            var point = new BMap.Point(positionArray[i][0], positionArray[i][1]);
            var myIcon = new BMap.Icon('images/icon_point.png', new BMap.Size(24, 24));
            addMark(point, myIcon);
        }
    };

    function addMark(point, myIcon) {
        // 生成图像标注
        var mark = new BMap.Marker(point, {
            icon: myIcon
        });
        map.addOverlay(mark);
        // 添加鼠标划入坐标点的显示内容
        str = '';
        str += '<div class="info-box">';
        str += '<p>备电点：100</p>';
        str += '<p>充点电：50</p>';
        str += '<p>换电点：200</p>';
        str += '<p>售电点：100</p>';
        str += '<p>储能站：100</p>';
        str += '<p>延寿站：100</p>';
        // str += '<p>蓄电池：400</p>';
        str += '</div>';
        // 创建一个文本标注实例
        var lable = new BMap.Label(str);
        // 清除百度地图自带样式
        lable.setStyle({
            border: 'none',
            border: '1px solid rgba(36,110,221, .5)',
            borderRadius: '5px'
        });
        // 设置标注的地理坐标
        lable.setPosition(point);
        // 默认不显示文本标注
        lable.hide();
        // 在全景场景内添加覆盖物
        map.addOverlay(lable);
        mark.addEventListener('mouseover', function () {
            lable.show();
        });
        mark.addEventListener('mouseout', function () {
            lable.hide();
        });
    }
    // 使用行政区划
    setTimeout(function () {
        getBoundary();
    }, 100);
}

$('.energy-tip p').on('click', function () {
    $(this).children('.energy-block').addClass('active')
    $(this).children('.energy-text').addClass('text-active');
    $(this).siblings().children('.energy-block').removeClass('active');
    $(this).siblings().children('.energy-text').removeClass('text-active');
});