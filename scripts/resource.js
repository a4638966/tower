var Resource = function () {
    this._urls = {};
    this._controls = {
            uploadDate: $('#uploadDate'),
            btnChart: $('#btnChart'),
            btnTable: $('#btnTable'),
            myChart: $('#myChart'),
            myTable: $('#myTable'),
            _layuiTag: $('.layui-tag'),
            // 能源保障
            bddsl: $('#bddsl'),
            cddsl: $('#cddsl'),
            hddsl: $('#hddsl'),
            sddsl: $('#sddsl'),
            xdcgm: $('#xdcgm'),
            cnzsl: $('#cnzsl'),
            yszsl: $('#yszsl'),
            xdcgm1: $('#xdcgm1'),
            tableList: $('#tableList')
        },
        this._commonData = {
            chartType: false,
            provinceId: 17,
            cityId: '',
            prefectureId: ''
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

    this.initEnergyBusiness('17', '', '');

    this.initEnergyProduct('17', '', '');

    this.initResourceCenterList('17', '', '');
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
        window.location.href = 'resource1.html?dataInfo=' + data_info + '&provinceId=' + that._commonData.provinceId + '&cityId=' + that._commonData.cityId + '&prefectureId=' + that._commonData.prefectureId + '';
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
    var provinceId = 17;
    var cityId = '';
    var prefectureId = '';
    map.enableScrollWheelZoom(true);
    var scrollFunc = function (e) {
        e = e || window.event;
        if (map.getZoom() > 8 && map.getZoom() < 10) {
            getBoundary('河南省');
            getMap(provinceId, '', '')
        }
    }
    /*注册事件*/
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    } //W3C
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
        });
    }
    // 使用添加点的方法
    getMap(provinceId, cityId, prefectureId);

    function getMap(provinceId, cityId, prefectureId) {
        $.ajax({
            url: 'http://www.baoxingtech.com:9603/sys/resource_center/resource_center_map',
            type: 'GET',
            dataType: 'json',
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
        str += '<div class="info-box">';
        str += '<p>' + data.name + '</p>';
        str += '<p>备电点：' + data.bddsl + '</p>';
        str += '<p>充点电：' + data.cddsl + '</p>';
        str += '<p>换电点：' + data.hddsl + '</p>';
        str += '<p>售电点：' + data.sddsl + '</p>';
        str += '<p>储能站：' + data.cnzsl + '</p>';
        str += '<p>延寿站：' + data.yszsl + '</p>';
        // str += '<p>蓄电池规模：' + data.xdcgmBdCdHdSd + '</p>';
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
        mark.addEventListener('mouseover', function (e) {
            lable.show();
        });
        mark.addEventListener('mouseout', function () {
            lable.hide();
        });

        mark.addEventListener('click', function (e) {
            getBoundary(data.name);
            if (map.getZoom() === 8) {
                cityId1 = data.id;
            } else if (map.getZoom() >= 10) {
                prefectureId1 = data.id
            }
            getMap(provinceId1, cityId1, prefectureId1);
            that.initEnergyBusiness(provinceId1, cityId1, prefectureId1);
            that.initEnergyProduct(provinceId1, cityId1, prefectureId1)
            that.initResourceCenterList(provinceId1, cityId1, prefectureId1)
            that._commonData.provinceId = provinceId1;
            that._commonData.cityId = cityId1;
            that._commonData.prefectureId = prefectureId1;
        });
    }
    // 使用行政区划
    setTimeout(function () {
        getBoundary('河南省');
    }, 100);
}

Resource.prototype.initEnergyBusiness = function (provinceId, cityId, prefectureId) {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/energy_business_data',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: provinceId,
            cityId: cityId,
            prefectureId: prefectureId
        },
        success: function (res) {
            if (res.code === 200) {
                res.result.bddsl === 0 ? that._controls.bddsl.html('-') : that._controls.bddsl.html(res.result.bddsl);
                res.result.cddsl === 0 ? that._controls.cddsl.html('-') : that._controls.cddsl.html(res.result.cddsl);
                res.result.hddsl === 0 ? that._controls.hddsl.html('-') : that._controls.hddsl.html(res.result.hddsl);
                res.result.sddsl === 0 ? that._controls.sddsl.html('-') : that._controls.sddsl.html(res.result.sddsl);
                res.result.xdcgm === 0 ? that._controls.xdcgm.html('-') : that._controls.xdcgm.html(res.result.xdcgm);
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

Resource.prototype.initEnergyProduct = function (provinceId, cityId, prefectureId) {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/energy_product_guarantee',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: provinceId,
            cityId: cityId,
            prefectureId: prefectureId
        },
        success: function (res) {
            if (res.code === 200) {
                res.result.cnzsl === 0 ? that._controls.cnzsl.html('-') : that._controls.cnzsl.html(res.result.cnzsl);
                res.result.yszsl === 0 ? that._controls.yszsl.html('-') : that._controls.yszsl.html(res.result.yszsl);
                res.result.xdcgm === 0 ? that._controls.xdcgm1.html('-') : that._controls.xdcgm1.html(res.result.xdcgm);
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

Resource.prototype.initResourceCenterList = function (provinceId, cityId, prefectureId) {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/resource_center_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: provinceId,
            cityId: cityId,
            prefectureId: prefectureId
        },
        success: function (res) {
            if (res.code === 200) {
                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        str += '<td>' + res.result[i].name + '</td>';
                        str += '<td>' + res.result[i].bddsl + '个</td>';
                        str += '<td>' + res.result[i].cddsl + '个</td>';
                        str += '<td>' + res.result[i].hddsl + '个</td>';
                        str += '<td>' + res.result[i].sddsl + '个</td>';
                        str += '<th style="border-right: 1px solid #e6e6e6">' + res.result[i].xdcgmBdCdHdSd + 'AH</th>'
                        str += '<td>' + res.result[i].cnzsl + '个</td>';
                        str += '<td>' + res.result[i].yszsl + '个</td>';
                        str += '<td>' + res.result[i].xdcgmCnzYsz + 'AH</td>';
                        str += '</tr>';
                    }
                    that._controls.tableList.html(str);
                } else {
                    that._controls.tableList.html('<td colspan="9" style="text-align:center">暂无数据</td>')
                }
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

$('.energy-tip p').on('click', function () {
    $(this).children('.energy-block').addClass('active')
    $(this).children('.energy-text').addClass('text-active');
    $(this).siblings().children('.energy-block').removeClass('active');
    $(this).siblings().children('.energy-text').removeClass('text-active');
});