var Resource = function () {
    this._urls = {};
    this._controls = {
            uploadDate: $('#uploadDate'),
            btnChart: $('#btnChart'),
            btnTable: $('#btnTable'),
            myChart: $('#myChart'),
            myTable: $('#myTable'),
            // 切换列表
            // 备电点
            btnStandbyPower: $('#btnStandbyPower'),
            standbyPowerTable: $('#standbyPowerTable'),
            tabdy1: $('#tabdy1'),
            // 充电点
            btnCharge: $('#btnCharge'),
            chargeTable: $('#chargeTable'),
            table2: $('#table2'),
            // 换电点
            btnPowerExchange: $('#btnPowerExchange'),
            powerExchangeTable: $('#powerExchangeTable'),
            // 售电点
            btnSellingElectricity: $('#btnSellingElectricity'),
            sellingElectricityTable: $('#sellingElectricityTable'),
            // 储能站
            btnProlongLife: $('#btnProlongLife'),
            prolongLifeTable: $('#prolongLifeTable'),
            table5: $('#table5'),
            // 延寿站
            btnEnergyStorage: $('#btnEnergyStorage'),
            energyStorageTable: $('#energyStorageTable'),
            table6: $('#table6'),
            // 蓄电池
            btnBatter: $('#btnBatter'),
            batteryTable: $('#batteryTable'),
            table7: $('#table7'),
            // 能源包
            btnEnergyPack: $('#btnEnergyPack'),
            energyPackTable: $('#energyPackTable'),
            table8: $('#table8')
        },
        this._commonData = {
            chartType: false,
            provinceId: '',
            cityId: '',
            prefectureId: ''
        }
}
Resource.prototype.initControl = function () {
    var that = this;
    // 初始化日期
    // this.initUpdate();
    layui.use(['tree', 'element'], function () {
        var element = layui.element;
        var tree = layui.tree;

        var cityArray = [];
        $.ajax({
            url: 'http://www.baoxingtech.com:9603/sys/area/shi',
            type: 'GET',
            dataType: 'json',
            data: {
                provinceId: 17
            },
            success: function (res) {
                for (var i = 0; i < res.result.length; i++) {
                    var spread = false;
                    if (res.result[i].name == '新乡市') {
                        spread = true;
                    }
                    cityArray.push({
                        name: res.result[i].name,
                        id: res.result[i].id,
                        spread: spread,
                        children: []
                    })
                }
                for (var i = 0; i < cityArray.length; i++) {
                    var num = 0;
                    $.ajax({
                        url: 'http://www.baoxingtech.com:9603/sys/area/qx',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            cityId: cityArray[i].id
                        },
                        success: function (res1) {
                            num++;
                            for (var i = 0; i < res1.result.length; i++) {
                                res1.result[i].pid = cityArray[num - 1].id
                                // console.log(cityArray[num - 1].id)
                            }

                            cityArray[num - 1].children = res1.result;
                        }
                    });
                }
                setTimeout(function () {
                    var inst1 = layui.tree({
                        elem: '#treeNav',
                        skin: 'shihuang',
                        nodes: [{ //节点
                            name: '河南省',
                            spread: true,
                            children: cityArray
                        }],
                        click: function (obj) {
                            if (obj.children === undefined) {
                                that._commonData.provinceId = 17;
                                that._commonData.cityId = obj.pid;
                                that._commonData.prefectureId = obj.id;

                                that._controls.btnStandbyPower.children('.energy-block').addClass('active')
                                that._controls.btnStandbyPower.children('.energy-text').addClass('text-active');
                                that._controls.btnStandbyPower.siblings().children('.energy-block').removeClass('active');
                                that._controls.btnStandbyPower.siblings().children('.energy-text').removeClass('text-active');
                                that._controls.standbyPowerTable.show();
                                that._controls.standbyPowerTable.siblings('table').hide();
                                that.initSecondBdList();
                            } else {
                                that._controls.btnStandbyPower.children('.energy-block').addClass('active')
                                that._controls.btnStandbyPower.children('.energy-text').addClass('text-active');
                                that._controls.btnStandbyPower.siblings().children('.energy-block').removeClass('active');
                                that._controls.btnStandbyPower.siblings().children('.energy-text').removeClass('text-active');
                                that._controls.standbyPowerTable.show();
                                that._controls.standbyPowerTable.siblings('table').hide();
                                that._commonData.provinceId = 17;
                                that._commonData.cityId = obj.id;
                                that._commonData.prefectureId = '';
                                that.initSecondBdList();
                            }
                        }
                    });
                }, 500)
            }
        });


    });

    $('.layui-radius').css('height', $(window).height() - 210)

    // 按钮事件
    // 备电
    this._controls.btnStandbyPower.on('click', function () {
        that._controls.btnStandbyPower.children('.energy-block').addClass('active')
        that._controls.btnStandbyPower.children('.energy-text').addClass('text-active');
        that._controls.btnStandbyPower.siblings().children('.energy-block').removeClass('active');
        that._controls.btnStandbyPower.siblings().children('.energy-text').removeClass('text-active');
        that._controls.standbyPowerTable.show();
        that._controls.standbyPowerTable.siblings('table').hide();
        that.initSecondBdList();
    });
    // 充电
    this._controls.btnCharge.on('click', function () {
        that._controls.btnCharge.children('.energy-block').addClass('active')
        that._controls.btnCharge.children('.energy-text').addClass('text-active');
        that._controls.btnCharge.siblings().children('.energy-block').removeClass('active');
        that._controls.btnCharge.siblings().children('.energy-text').removeClass('text-active');
        that._controls.chargeTable.show();
        that._controls.chargeTable.siblings('table').hide();
        that.initSecondCdList();
    });
    // 换电
    this._controls.btnPowerExchange.on('click', function () {
        that._controls.btnPowerExchange.children('.energy-block').addClass('active')
        that._controls.btnPowerExchange.children('.energy-text').addClass('text-active');
        that._controls.btnPowerExchange.siblings().children('.energy-block').removeClass('active');
        that._controls.btnPowerExchange.siblings().children('.energy-text').removeClass('text-active');
        that._controls.powerExchangeTable.show();
        that._controls.powerExchangeTable.siblings('table').hide();
    });
    // 售电
    this._controls.btnSellingElectricity.on('click', function () {
        that._controls.btnSellingElectricity.children('.energy-block').addClass('active')
        that._controls.btnSellingElectricity.children('.energy-text').addClass('text-active');
        that._controls.btnSellingElectricity.siblings().children('.energy-block').removeClass('active');
        that._controls.btnSellingElectricity.siblings().children('.energy-text').removeClass('text-active');
        that._controls.sellingElectricityTable.show();
        that._controls.sellingElectricityTable.siblings('table').hide();
    });
    // 储能站
    this._controls.btnProlongLife.on('click', function () {
        that._controls.btnProlongLife.children('.energy-block').addClass('active')
        that._controls.btnProlongLife.children('.energy-text').addClass('text-active');
        that._controls.btnProlongLife.siblings().children('.energy-block').removeClass('active');
        that._controls.btnProlongLife.siblings().children('.energy-text').removeClass('text-active');
        that._controls.prolongLifeTable.show();
        that._controls.prolongLifeTable.siblings('table').hide();
        that.initSecondCnzList();
    });
    // 延寿站
    this._controls.btnEnergyStorage.on('click', function () {
        that._controls.btnEnergyStorage.children('.energy-block').addClass('active')
        that._controls.btnEnergyStorage.children('.energy-text').addClass('text-active');
        that._controls.btnEnergyStorage.siblings().children('.energy-block').removeClass('active');
        that._controls.btnEnergyStorage.siblings().children('.energy-text').removeClass('text-active');
        that._controls.energyStorageTable.show();
        that._controls.energyStorageTable.siblings('table').hide();
        that.initSecondYszList();
    });
    // 蓄电池
    this._controls.btnBatter.on('click', function () {
        that._controls.btnBatter.children('.energy-block').addClass('active')
        that._controls.btnBatter.children('.energy-text').addClass('text-active');
        that._controls.btnBatter.siblings().children('.energy-block').removeClass('active');
        that._controls.btnBatter.siblings().children('.energy-text').removeClass('text-active');
        that._controls.batteryTable.show();
        that._controls.batteryTable.siblings('table').hide();
        that.initSecondXdcList();
    });
    // 能源包
    this._controls.btnEnergyPack.on('click', function () {
        that._controls.btnEnergyPack.children('.energy-block').addClass('active')
        that._controls.btnEnergyPack.children('.energy-text').addClass('text-active');
        that._controls.btnEnergyPack.siblings().children('.energy-block').removeClass('active');
        that._controls.btnEnergyPack.siblings().children('.energy-text').removeClass('text-active');
        that._controls.energyPackTable.show();
        that._controls.energyPackTable.siblings('table').hide();
        that.initSecondNybList();
    });
    // 根据参数判断哪个显示
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    that._commonData.provinceId = theRequest.provinceId;
    that._commonData.cityId = theRequest.cityId;
    that._commonData.prefectureId = theRequest.prefectureId;
    switch (theRequest.dataInfo) {
        // 备电
        case 'standbyPower':
            that._controls.btnStandbyPower.children('.energy-block').addClass('active')
            that._controls.btnStandbyPower.children('.energy-text').addClass('text-active');
            that._controls.standbyPowerTable.show();
            break;
            // 充电
        case 'charge':
            that._controls.btnCharge.children('.energy-block').addClass('active')
            that._controls.btnCharge.children('.energy-text').addClass('text-active');
            that._controls.chargeTable.show();
            break;
            // 换电
        case 'powerExchange':
            that._controls.btnPowerExchange.children('.energy-block').addClass('active')
            that._controls.btnPowerExchange.children('.energy-text').addClass('text-active');
            that._controls.powerExchangeTable.show();
            break;
            // 售电
        case 'sellingElectricity':
            that._controls.btnSellingElectricity.children('.energy-block').addClass('active')
            that._controls.btnSellingElectricity.children('.energy-text').addClass('text-active');
            that._controls.sellingElectricityTable.show();
            break;
            // 储能站
        case 'prolongLife':
            that._controls.btnProlongLife.children('.energy-block').addClass('active')
            that._controls.btnProlongLife.children('.energy-text').addClass('text-active');
            that._controls.prolongLifeTable.show();
            break;
            // 延寿站
        case 'energyStorage':
            that._controls.btnEnergyStorage.children('.energy-block').addClass('active')
            that._controls.btnEnergyStorage.children('.energy-text').addClass('text-active');
            that._controls.energyStorageTable.show();
            break;
            // 蓄电池batter
        case 'batter':
            that._controls.btnBatter.children('.energy-block').addClass('active')
            that._controls.btnBatter.children('.energy-text').addClass('text-active');
            that._controls.batteryTable.show();
            break;
            // 能源包
    }
    this.initSecondBdList();
    // 初始化地图
    // this.initChart();
    // 按钮事件
    // this._controls.btnChart.on('click', function () {
    //   that._controls.myChart.show();
    //   that._controls.myTable.hide();
    //   $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
    //   that._controls.btnTable.addClass('layui-btn-primary').removeClass('layui-btn-normal');
    //   setTimeout(function () {
    //     that._commonData.chartType = true;
    //     that.initChart.getBoundary;
    //   }, 100);
    // });
    // that._controls.btnTable.on('click', function () {
    //   that._controls.myChart.hide();
    //   that._controls.myTable.show();
    //   $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
    //   that._controls.btnChart.removeClass('layui-btn-normal').addClass('layui-btn-primary');
    // });
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

    var date = new Date(new Date().getTime()); // + (1000 * 60 * 60 * 72));
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
            [113.701699, 34.756999],
            [113.585998, 34.714994],
            [113.768533, 34.714638],
            [112.977737, 34.658004],
            [113.861957, 34.534389],
            [114.45412, 36.092283],
            [114.477099, 35.745347],
            [112.56378, 33.324863],
            [115.69132, 34.307679]
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
Resource.prototype.initSecondBdList = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/second_bd_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {

                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        str += '<td>' + res.result[i].name + '</td>';
                        str += '<td>' + res.result[i].customerName + '</td>';
                        str += '<td>' + res.result[i].panelName + '</td>';
                        str += '<td>' + res.result[i].deviceCode + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].readyTime + 'H</td>';
                        str += '<td>' + res.result[i].batType + '</td>';
                        str += '<td>' + res.result[i].capacity + 'AH</td>';
                        str += '<td>' + res.result[i].dcglq + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].dcddsbl + '</td>';
                        str += '<td>' + res.result[i].fdcs + '次</td>';
                        str += '<td>' + res.result[i].zcbdsc + 'H</td>';
                        str += '</tr>';
                    }
                    that._controls.tabdy1.html(str);
                } else {
                    that._controls.tabdy1.html('<tr><td colspan="11" style="text-align: center">暂无数据</td></tr>');
                }
            } else {
                layer.msg(res.message);
                that._controls.tabdy1.html('<tr><td colspan="11" style="text-align: center">暂无数据</td></tr>');
            }
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
}

Resource.prototype.initSecondCdList = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/second_cd_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {

                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        str += '<td>' + res.result[i].name + '</td>';
                        str += '<td>' + res.result[i].cdzmc + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].deviceCode + '</td>';
                        str += '<td>' + res.result[i].ydnybsl + '个</td>';
                        str += '<td>' + res.result[i].capacity + 'AH</td>';
                        str += '<td>' + res.result[i].dtusl + '个</td>';
                        str += '<td>' + res.result[i].nycsl + '辆</td>';
                        str += '<td>' + res.result[i].nbqsl + '个</td>';
                        str += '<td>' + res.result[i].hlqsl + '个</td>';
                        str += '<td>' + res.result[i].cdzsl + '个</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].cdwsl + '个</td>';
                        str += '<td>-</td>';
                        str += '</tr>';
                    }
                    that._controls.table2.html(str);
                } else {
                    that._controls.table2.html('<tr><td colspan="12" style="text-align: center">暂无数据</td></tr>');
                }
            } else {
                layer.msg(res.message);
                that._controls.table2.html('<tr><td colspan="12" style="text-align: center">暂无数据</td></tr>');
            }
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
}

Resource.prototype.initSecondCnzList = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/second_cnz_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {

                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        for (var j = 0; j < res.result[i].deviceList.length; j++) {
                            str += '<tr>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].name + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].cnzmc + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].deviceList[j].name + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].deviceCode + '</td>';
                            str += '<td style="border-right: 1px solid #e6e6e6">' +'<a href="" onclick="window.open(\'http://www.baoxingtech.com:9603/#/?panelId=' + res.result[i].panelId + '\')">'+'进入' +'</a>' +'</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].deviceList[j].batType + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].capacity + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].deviceList[j].dcglq + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')" style="border-right: 1px solid #e6e6e6">' + res.result[i].gffdl + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].rjfdsc + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].ljfdrl + '</td>';
                            str += '<td onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].deviceList[j].id + '\')">' + res.result[i].ljxhcs + '</td>';
                            str += '</tr>';
                        }
                    }
                    that._controls.table5.html(str);
                } else {
                    that._controls.table5.html('<tr><td colspan="11" style="text-align: center">暂无数据</td></tr>');
                }
            } else {
                layer.msg(res.message);
                that._controls.table5.html('<tr><td colspan="11" style="text-align: center">暂无数据</td></tr>');
            }
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
}

Resource.prototype.initSecondYszList = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/second_ysz_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {
                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr onclick="window.open(\'http://www.baoxingtech.com:2037/escape/siteDetail.html?panelId=' + res.result[i].panelId + '\')">';
                        str += '<td>' + res.result[i].name + '</td>';
                        str += '<td>' + res.result[i].yszmc + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].deviceCode + '</td>';
                        str += '<td>' + res.result[i].batType + '</td>';
                        str += '<td>' + res.result[i].capacity + '</td>';
                        str += '<td>' + res.result[i].dcglq + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].qysj + '</td>';
                        str += '<td>' + res.result[i].bdsj + '</td>';
                        str += '<td>' + res.result[i].mcyjfdsc + '</td>';
                        str += '</tr>';
                    }
                    that._controls.table6.html(str);
                } else {
                    that._controls.table6.html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>');
                }
            } else {
                layer.msg(res.message);
                that._controls.table6.html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>');
            }
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
}

Resource.prototype.initSecondXdcList = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/second_xdc_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {
                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        str += '<td>' + res.result[i].name + '</td>';
                        str += '<td>' + res.result[i].xdcbh + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].zzywid + '</td>';
                        str += '<td>' + res.result[i].batType + '</td>';
                        str += '<td>' + res.result[i].capacity + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].rwsj + '</td>';
                        str += '<td>' + res.result[i].mchr + '</td>';
                        str += '<td>' + res.result[i].bdsc + '</td>';
                        str += '<td>' + res.result[i].soh + '</td>';
                        str += '</tr>';
                    }
                    that._controls.table7.html(str);
                } else {
                    that._controls.table7.html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>');
                }
            } else {
                layer.msg(res.message);
                that._controls.table7.html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>');
            }
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
}

Resource.prototype.initSecondNybList = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/resource_center/second_nyb_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {
                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        str += '<td>' + res.result[i].name + '</td>';
                        str += '<td>' + res.result[i].xdcbh + '</td>';
                        str += '<td>' + res.result[i].zzywid + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].zzywid + '</td>';
                        str += '<td>' + res.result[i].batType + '</td>';
                        str += '<td>' + res.result[i].capacity + '</td>';
                        str += '<td>' + res.result[i].rwsj + '</td>';
                        str += '<td>' + res.result[i].mchr + '</td>';
                        str += '<td style="border-right: 1px solid #e6e6e6">' + res.result[i].bdsc + '</td>';
                        str += '</tr>';
                    }
                    that._controls.table8.html(str);
                } else {
                    that._controls.table8.html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>');
                }
            } else {
                layer.msg(res.message);
                that._controls.table8.html('<tr><td colspan="9" style="text-align: center">暂无数据</td></tr>');
            }
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
}