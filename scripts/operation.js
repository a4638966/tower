var Operation = function() {
    this._urls = {};
    this._controls = {
            uploadDate: $('#uploadDate'),
            btnChart: $('#btnChart'),
            btnTable: $('#btnTable'),
            myChart: $('#myChart'),
            myTable: $('#myTable')
        },
        this._commonData = {
            chartType: false,
            provinceId: 17,
            cityId: '',
            prefectureId: ''
        }
}
Operation.prototype.initControl = function() {
    var that = this;
    // 初始化日期
    this.initUpdate();
    // 初始化layui
    layui.use('element', function() {
        var element = layui.element;
    });
    // 初始化地图
    this.initChart();
    this.getLeftData();
    // 按钮事件
    this._controls.btnChart.on('click', function() {
        that._controls.myChart.show();
        that._controls.myTable.hide();
        $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnTable.addClass('layui-btn-primary').removeClass('layui-btn-normal');
        setTimeout(function() {
            that._commonData.chartType = true;
            that.initChart.getBoundary;
        }, 100);
    });
    that._controls.btnTable.on('click', function() {
        that._controls.myChart.hide();
        that._controls.myTable.show();
        $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnChart.removeClass('layui-btn-normal').addClass('layui-btn-primary');
    });

    $('.operation-content').on('click', function() {
        window.location.href = 'operation-detail.html';
    })
};
// 初始化日期
Operation.prototype.initUpdate = function() {
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

    var date = new Date(new Date().getTime());// + (1000 * 60 * 60 * 72));
    var date_str = fortime(date);
    that._controls.uploadDate.html(date_str)
};
Operation.prototype.initChart = function () {
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
    var provinceId = 17;
    var cityId = '';
    var prefectureId = '';
    map.enableScrollWheelZoom(true);
    var scrollFunc = function (e) {
        e = e || window.event;
        if (map.getZoom() > 8 && map.getZoom() < 10) {
            that._commonData.provinceId = 17;
            that._commonData.cityId = '';
            that._commonData.prefectureId = '';
            getBoundary('河南省');
            that.getLeftData();
        }
    }
    /*注册事件*/
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    } //W3C

    // 定义一个控件类,即function
    function ZoomControl() {
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(10, 10);
    }

    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();

    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function (map) {
        // 创建一个DOM元素
        var div = document.createElement("div");
        // 添加文字说明
        div.appendChild(document.createTextNode("返回"));
        // 设置样式
        div.style.cursor = "pointer";
        div.style.border = "1px solid #1E9FFF";
        div.style.backgroundColor = "#1E9FFF";
        div.style.color = "#fff";
        div.style.padding = "5px 10px";
        div.style.borderRadius = '10px';
        // 绑定事件,点击一次放大两级
        div.onclick = function (e) {
            that._commonData.provinceId = 17;
            that._commonData.cityId = '';
            that._commonData.prefectureId = '';
            getBoundary('河南省');
            that.getLeftData();
        }
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
    }
    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);

    window.onmousewheel = document.onmousewheel = scrollFunc; //IE/Opera/Chrome
    // 声明一个数组，装行政区域的数据
    var blist = [];
    // 设置一个计数器，用来判断什么时候加载完成行政区域，然后画图
    var districtLoading = 0;
    // 添加行政区划
    function getBoundary(name) {
        // 计数器来控制加载过程
        districtLoading++;
        // 创建行政区划的对象实例
        var bdary = new BMap.Boundary();
        // 获取行政区域
        // 清除地图覆盖物
        map.clearOverlays();
        bdary.get(name, function (rs) {
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
                    name: name
                })
            }
            // 调整视野
            // map.setViewport(pointArray);
            // 执行完成后计数器 -1；
            districtLoading--;
            if (districtLoading === 0) {
                // 画多边形来框选地图范围（边界）
                drawBoundary(name);
            }
        });
    }

    function drawBoundary(name) {
        var bdary = new BMap.Boundary();
        bdary.get(name, function (rs) { //获取行政区域     
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
            getMap(that._commonData.provinceId, that._commonData.cityId, that._commonData.prefectureId);
        });
    }
    // 使用添加点的方法
    

    function getMap(provinceId, cityId, prefectureId) {
        $.ajax({
            url: 'http://www.baoxingtech.com:9604/sys/operation_center/map',
            type: 'GET',
            dataType: 'json',
            headers:{'Admin-Token':$.cookie('adminToken')},
            data: {
                provinceId: provinceId,
                cityId: cityId,
                prefectureId: prefectureId
            },
            success: function (res) {
                if (res.code === 200) {
                    addPoint(res.result);
                } else if (res.code === 500) {
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.msg(res.message);
                    });
                }
            },
            error: function () {
                layer.msg('数据异常！');
            }
        });
    }

    // 添加坐标点
    function addPoint(data) {
        // 生成坐标点
        // 我这里是随机取了河南省的几个坐标，用来添加坐标点
        var positionArray = []
        for (var i = 0; i < data.length; i++) {
            positionArray.push([data[i].longitude, data[i].latitude])
        }
        if (positionArray.length > 0) {
            for (var i = 0; i < positionArray.length; i++) {
                // 一个坐标对应一个mark的生成
                var point = new BMap.Point(positionArray[i][0], positionArray[i][1]);
                var myIcon = new BMap.Icon('images/icon_point.png', new BMap.Size(24, 24));
                addMark(point, myIcon, data[i]);
            }
        }
    };

    var provinceId1 = '17';
    var cityId1 = '';
    var prefectureId1 = '';

    function addMark(point, myIcon, data) {
        // 生成图像标注
        var mark = new BMap.Marker(point, {
            icon: myIcon
        });
        map.addOverlay(mark);
        // 添加鼠标划入坐标点的显示内容
        str = '';
        str += '<div class="chart-info-box" style="padding-top: 50px;">';
        str += '<h1>新乡市</h1>';
        str += '<div class="chart-info-item">';
        str += '<p>蓄电池保障:</p>';
        str += '<p>正常:<span>' + data.xdczcsl + '</span>&nbsp;&nbsp;预警:<span>' + data.xdcgjsl + '</span>&nbsp;&nbsp;应急:<span>' + data.xdcyjsl + '</span></p>';
        str += '<p>储存量:<span>' + data.xdccdl + '</span>&nbsp;&nbsp;释放能量:<span>' + data.xdcfdl + '</span>&nbsp;&nbsp;光伏充电量(KWH):<span>' + data.xdcgfcdl + '</span>&nbsp;&nbsp;</p>';
        str += '</div>';
        str += '<div class="chart-info-item">';
        str += '<p>充电站:</p>';
        str += '<p>正常:<span>' + data.cdzzcsl + '</span>&nbsp;&nbsp;预警:<span>' + data.cdzgjsl + '</span>&nbsp;&nbsp;应急:<span>' + data.cdzyjsl + '</span></p>';
        str += '<p>储存量:<span>' + data.cdzcdl + '</span>&nbsp;&nbsp;释放能量:<span>' + data.cdzfdl + '</span>&nbsp;&nbsp;光伏充电量(KWH):<span>' + data.cdzgfcdl + '</span>&nbsp;&nbsp;</p>';
        str += '</div>';
        str += '<div class="chart-info-item">';
        str += '<p>移动电池包:</p>';
        str += '<p>正常:<span>' + data.yddcbzcsl + '</span>&nbsp;&nbsp;预警:<span>' + data.yddcbgjsl + '</span>&nbsp;&nbsp;应急:<span>' + data.yddcbyjsl + '</span></p>';
        str += '<p>储存量:<span>' + data.yddcbcdl + '</span>&nbsp;&nbsp;释放能量:<span>' + data.yddcbfdl + '</span>&nbsp;&nbsp;光伏充电量(KWH):<span>' + data.yddcbgfcdl + '</span>&nbsp;&nbsp;</p>';
        str += '</div>';
        str += '<div class="chart-info-item">';
        str += '<p>储能中心:</p>';
        str += '<p>正常:<span>' + data.cnzzcsl + '</span>&nbsp;&nbsp;预警:<span>' + data.cnzgjsl + '</span>&nbsp;&nbsp;应急:<span>' + data.cnzyjsl + '</span></p>';
        str += '<p>储存量:<span>' + data.cnzcdl + '</span>&nbsp;&nbsp;释放能量:<span>' + data.cnzfdl + '</span>&nbsp;&nbsp;光伏充电量(KWH):<span>' + data.cnzgfcdl + '</span>&nbsp;&nbsp;</p>';
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
        // 默认不显示文本标注
        lable.hide();
        // 在全景场景内添加覆盖物
        map.addOverlay(lable);
        mark.addEventListener('mouseover', function (e) {
            lable.show();
        });
        mark.addEventListener('mouseout', function () {
            lable.hide();
        });

        mark.addEventListener('click', function (e) {
            
            if (map.getZoom() === 8) {
                that._commonData.cityId = data.id;
                getBoundary(data.name);
                that.getLeftData();
            } else if (map.getZoom() >= 10) {
                that._commonData.prefectureId = data.id
            }
           
        });
    }
    // 使用行政区划
    setTimeout(function () {
        getBoundary('河南省');
    }, 100);
}
Operation.prototype.getLeftData = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/operation_center/left_data',
        type: 'GET',
        dataType: 'json',
        headers:{'Admin-Token':$.cookie('adminToken')},
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId
        },
        success: function (res) {
            if (res.code === 200) {
                $('#bdkhsl').html(res.result.bdkhsl);
                $('#bddsl').html(res.result.bddsl);
                $('#bddsl1').html(res.result.bddsl);
                $('#bdkhgddcrl').html(res.result.bdkhgddcrl);
                $('#cddsl').html(res.result.cddsl);
                $('#cddcdzl').html(res.result.cddcdzl);
                $('#yddcbsl').html(res.result.yddcbsl);
                $('#yddcbrl').html(res.result.yddcbrl);
                $('#fdcs').html(res.result.fdcs);
                $('#fdcs1').html(res.result.fdcs);
                $('#hdcs1').html(res.result.fdcs);
                $('#hddsl').html(res.result.hddsl);
                $('#hdnybsl').html(res.result.hdnybsl);
                $('#hdnybrl').html(res.result.hdnybrl);
                $('#sddsl').html(res.result.sddsl);
                $('#sdl').html(res.result.sdl);
                $('#zwsbzl').html(res.result.zwsbzl);
                $('#nyfwcl').html(res.result.nyfwcl);
                $('#nyfwrysl').html(res.result.nyfwrysl);
                $('#cnzsl').html(res.result.cnzsl);
                $('#cnzrl').html(res.result.cnzrl);
                $('#cnzcdzl').html(res.result.cnzcdzl);
                $('#cnzcdzlje').html(res.result.cnzcdzlje);
                $('#yszsl').html(res.result.yszsl);
                $('#yszpjyjsc').html(res.result.yszpjyjsc);
            }
        }
    });
}