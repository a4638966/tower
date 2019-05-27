var Resource = function() {
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
            // 充电点
            btnCharge: $('#btnCharge'),
            chargeTable: $('#chargeTable'),
            // 换电点
            btnPowerExchange: $('#btnPowerExchange'),
            powerExchangeTable: $('#powerExchangeTable'),
            // 售电点
            btnSellingElectricity: $('#btnSellingElectricity'),
            sellingElectricityTable: $('#sellingElectricityTable'),
            // 储能站
            btnProlongLife: $('#btnProlongLife'),
            prolongLifeTable: $('#prolongLifeTable'),
            // 延寿站
            btnEnergyStorage: $('#btnEnergyStorage'),
            energyStorageTable: $('#energyStorageTable'),
            // 蓄电池
            btnBatter: $('#btnBatter'),
            batteryTable: $('#batteryTable'),
            // 能源包
            btnEnergyPack: $('#btnEnergyPack'),
            energyPackTable: $('#energyPackTable')
        },
        this._commonData = {
            chartType: false
        }
}
Resource.prototype.initControl = function() {
    var that = this;
    // 初始化日期
    // this.initUpdate();
    layui.use(['tree', 'element'], function() {
        var element = layui.element;
        layui.tree({
            elem: '#treeNav',
            skin: 'shihuang',
            nodes: [{ //节点
                name: '河南省',
                spread: true,
                children: [{
                    name: '新乡市',
                    spread: true,
                    children: [{
                        name: '红旗区'
                        },
                        {
                            name: '辉县市'
                        }, {
                            name: '原阳县'
                        }, {
                            name: '卫辉市'
                        }
                    ]
                }, {
                    name: '洛阳市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '郑州市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '安阳市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '鹤壁市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '济源市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '焦作市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '开封市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '漯河市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '南阳市',
                    children: [{
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '平顶山市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }, {
                    name: '濮阳市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }, {
                    name: '三门峡市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }, {
                    name: '商丘市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }, {
                    name: '信阳市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }, {
                    name: '许昌市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }, {
                    name: '周口市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }, {
                    name: '驻马店市',
                    children: [{
                        name: '二七区'
                    }
                    ]
                }]
            }]
        });
    });

    // 按钮事件
    // 备电
    this._controls.btnStandbyPower.on('click', function() {
        that._controls.btnStandbyPower.children('.energy-block').addClass('active')
        that._controls.btnStandbyPower.children('.energy-text').addClass('text-active');
        that._controls.btnStandbyPower.siblings().children('.energy-block').removeClass('active');
        that._controls.btnStandbyPower.siblings().children('.energy-text').removeClass('text-active');
        that._controls.standbyPowerTable.show();
        that._controls.standbyPowerTable.siblings('table').hide();
    });
    // 充电
    this._controls.btnCharge.on('click', function() {
        that._controls.btnCharge.children('.energy-block').addClass('active')
        that._controls.btnCharge.children('.energy-text').addClass('text-active');
        that._controls.btnCharge.siblings().children('.energy-block').removeClass('active');
        that._controls.btnCharge.siblings().children('.energy-text').removeClass('text-active');
        that._controls.chargeTable.show();
        that._controls.chargeTable.siblings('table').hide();
    });
    // 换电
    this._controls.btnPowerExchange.on('click', function() {
        that._controls.btnPowerExchange.children('.energy-block').addClass('active')
        that._controls.btnPowerExchange.children('.energy-text').addClass('text-active');
        that._controls.btnPowerExchange.siblings().children('.energy-block').removeClass('active');
        that._controls.btnPowerExchange.siblings().children('.energy-text').removeClass('text-active');
        that._controls.powerExchangeTable.show();
        that._controls.powerExchangeTable.siblings('table').hide();
    });
    // 售电
    this._controls.btnSellingElectricity.on('click', function() {
        that._controls.btnSellingElectricity.children('.energy-block').addClass('active')
        that._controls.btnSellingElectricity.children('.energy-text').addClass('text-active');
        that._controls.btnSellingElectricity.siblings().children('.energy-block').removeClass('active');
        that._controls.btnSellingElectricity.siblings().children('.energy-text').removeClass('text-active');
        that._controls.sellingElectricityTable.show();
        that._controls.sellingElectricityTable.siblings('table').hide();
    });
    // 储能站
    this._controls.btnProlongLife.on('click', function() {
        that._controls.btnProlongLife.children('.energy-block').addClass('active')
        that._controls.btnProlongLife.children('.energy-text').addClass('text-active');
        that._controls.btnProlongLife.siblings().children('.energy-block').removeClass('active');
        that._controls.btnProlongLife.siblings().children('.energy-text').removeClass('text-active');
        that._controls.prolongLifeTable.show();
        that._controls.prolongLifeTable.siblings('table').hide();
    });
    // 延寿站
    this._controls.btnEnergyStorage.on('click', function() {
        that._controls.btnEnergyStorage.children('.energy-block').addClass('active')
        that._controls.btnEnergyStorage.children('.energy-text').addClass('text-active');
        that._controls.btnEnergyStorage.siblings().children('.energy-block').removeClass('active');
        that._controls.btnEnergyStorage.siblings().children('.energy-text').removeClass('text-active');
        that._controls.energyStorageTable.show();
        that._controls.energyStorageTable.siblings('table').hide();
    });
    // 蓄电池
    this._controls.btnBatter.on('click', function() {
        that._controls.btnBatter.children('.energy-block').addClass('active')
        that._controls.btnBatter.children('.energy-text').addClass('text-active');
        that._controls.btnBatter.siblings().children('.energy-block').removeClass('active');
        that._controls.btnBatter.siblings().children('.energy-text').removeClass('text-active');
        that._controls.batteryTable.show();
        that._controls.batteryTable.siblings('table').hide();
    });
    // 能源包
    this._controls.btnEnergyPack.on('click', function() {
        that._controls.btnEnergyPack.children('.energy-block').addClass('active')
        that._controls.btnEnergyPack.children('.energy-text').addClass('text-active');
        that._controls.btnEnergyPack.siblings().children('.energy-block').removeClass('active');
        that._controls.btnEnergyPack.siblings().children('.energy-text').removeClass('text-active');
        that._controls.energyPackTable.show();
        that._controls.energyPackTable.siblings('table').hide();
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
Resource.prototype.initUpdate = function() {
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
Resource.prototype.initChart = function() {
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
        bdary.get("河南省", function(rs) {
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
        bdary.get("河南省", function(rs) { //获取行政区域     
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
        mark.addEventListener('mouseover', function() {
            lable.show();
        });
        mark.addEventListener('mouseout', function() {
            lable.hide();
        });
    }
    // 使用行政区划
    setTimeout(function() {
        getBoundary();
    }, 100);
}