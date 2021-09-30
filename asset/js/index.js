//The reason of using JQuery:
//Rendering dynamically userlist and pagination requires to use jQuery's event agent to bind events.
window.onload = function() {

    let userlist = [{
        id: '1',
        username: 'donnie',
        nickname: '1',
        sex: 'male',
        email: '1071746237@qq.com'
    }, {
        id: '2',
        username: 'ragen',
        nickname: '2',
        sex: 'female',
        email: '2357112347@qq.com'
    }, {
        id: '3',
        username: 'bobbi',
        nickname: '3',
        sex: 'male',
        email: '427754017@qq.com'
    }, {
        id: '4',
        username: 'sunny',
        nickname: '4',
        sex: 'male',
        email: '2235466778@qq.com'
    }, {
        id: '5',
        username: 'abby',
        nickname: '5',
        sex: 'female',
        email: '8658999@qq.com'
    }, {
        id: '6',
        username: 'jeff',
        nickname: '6',
        sex: 'male',
        email: '533566778@qq.com'
    }, {
        id: '7',
        username: 'bob',
        nickname: '7',
        sex: 'male',
        email: '135679988@qq.com'
    }, {
        id: '8',
        username: 'gris',
        nickname: '8',
        sex: 'female',
        email: '2453647479@qq.com'
    }, {
        id: '9',
        username: 'martin',
        nickname: '9',
        sex: 'male',
        email: '2455457885@qq.com'
    }, {
        id: '10',
        username: 'fobby',
        nickname: '10',
        sex: 'female',
        email: '5336788@qq.com'
    }, {
        id: '11',
        username: 'riggy',
        nickname: '11',
        sex: 'male',
        email: '678843678@qq.com'
    }]
    let userlistCopy = JSON.parse(JSON.stringify(userlist));

    //Pagination section
    var pagesize = 3; //Number of data displayed on one page 
    var pagenum = 1; //The current page number

    render(userlist, pagesize, pagenum);

    var selectBox = document.querySelector('.select-box');
    selectBox.onchange = function() {
        pagesize = this.value;
        var pagesum = Math.ceil(userlist.length / pagesize);
        if (pagenum > pagesum) {
            pagenum = pagesum;
        }
        render(userlist, pagesize, pagenum);
    }

    $('.pagination ul').on('click', 'li', function() {
        pagenum = parseInt(this.innerText);
        render(userlist, pagesize, pagenum);
    })

    var iconLeft = document.querySelector('.layui-icon-left');
    var iconRight = document.querySelector('.layui-icon-right');
    var iconPrev = document.querySelector('.layui-icon-prev');
    var iconNext = document.querySelector('.layui-icon-next');
    iconLeft.onclick = function() {
        if (pagenum > 1) {
            pagenum--;
        }
        render(userlist, pagesize, pagenum);
    }
    iconRight.onclick = function() {
        var pagesum = Math.ceil(userlist.length / pagesize);
        if (pagenum < pagesum) {
            pagenum++;
        }
        render(userlist, pagesize, pagenum);
    }
    iconPrev.onclick = function() {
        pagenum = 1;
        render(userlist, pagesize, pagenum);
    }
    iconNext.onclick = function() {
        var pagesum = Math.ceil(userlist.length / pagesize);
        pagenum = pagesum;
        render(userlist, pagesize, pagenum);
    }

    layui.form.verify({
        username: [
            /^[\S]{2,6}$/, '用户名必须2到6位，且不能出现空格'
        ],
        nickname: [
            /^[\S]{2,6}$/, '昵称必须2到6位，且不能出现空格'
        ],
        email: [
            /^\w+@[a-z0-9]+\.[a-z]{2,4}$/, '邮箱必须符合xxx@xx.xx'
        ]
    })

    var createBtn = document.querySelector('.create-btn');
    var refreshBtn = document.querySelector('.refresh-btn');
    var layer = layui.layer;
    var userId = '12';
    createBtn.onclick = function() {
        //open create-layer by layui
        createLayer = layer.open({
            title: 'Create User',
            type: 1,
            area: ['600px', '330px'],
            content: document.querySelector('#createlayer').innerHTML
        });
        layui.form.render();
        //monitor submit event and insert new data
        layui.form.on('submit(formDemo)', function(data) {
            data.field.id = userId + '';
            userId = parseInt(userId) + 1;
            userlist.push(data.field);
            pagenum = Math.ceil(userlist.length / pagesize);
            render(userlist, pagesize, pagenum);
            layer.close(createLayer);
            return false;
        });
    }
    refreshBtn.onclick = function() {
        render(userlistCopy, pagesize, pagenum);
        userlist = JSON.parse(JSON.stringify(userlistCopy));

    }
    $('tbody').on('click', '.delete-btn', function() {
        var that = this;
        //open confirm layer by layui
        layer.confirm('Do you want to continue to delete it?', { icon: 3, title: 'WARNING' }, function(index) {
            //control pagenum's change
            var deleteBtns = document.querySelectorAll('.delete-btn');
            if (deleteBtns.length === 1) {
                pagenum--;
            }
            //delete the current row data
            var deleteBtnIndex = that.getAttribute('index');
            userlist = userlist.filter(item => {
                return item.id !== deleteBtnIndex;
            })
            render(userlist, pagesize, pagenum);
            layer.close(index);
        });
    })
    $('tbody').on('click', '.edit-btn', function() {
        //open edit-layer by layui
        editLayer = layer.open({
            title: 'Edit UserInfo',
            type: 1,
            area: ['600px', '340px'],
            content: document.querySelector('#createlayer').innerHTML
        });
        //get current row data and render
        var editBtnIndex = this.getAttribute('index');
        userlist.forEach(item => {
            if (item.id === editBtnIndex) {
                layui.form.val("formdata", item);
            }
        });
        //monitor submit event and update current row data
        layui.form.on('submit(formDemo)', function(data) {
            userlist.forEach((item, index) => {
                if (item.id === editBtnIndex) {
                    userlist[index] = data.field;
                }
            })
            render(userlist, pagesize, pagenum);
            layer.close(editLayer);
            return false;
        });
    });

    function render(userlist, pagesize, pagenum) {
        //render userlist according to pagesize and pagenum
        var htmlStr = '';
        var start = (pagenum - 1) * pagesize;
        var end = (pagesize * pagenum) > userlist.length ? userlist.length : (pagesize * pagenum);
        for (var i = start; i < end; i++) {
            htmlStr += `
            <tr>
                <td>
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary icon-btn edit-btn" index="${userlist[i].id}">
                        <i class="layui-icon layui-icon-edit"></i>
                    </button>
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary icon-btn delete-btn" index="${userlist[i].id}">
                        <i class="layui-icon layui-icon-delete"></i>
                    </button>
                </td>
                <td>${userlist[i].username}</td>
                <td>${userlist[i].nickname}</td>
                <td>${userlist[i].sex}</td>
                <td>${userlist[i].email}</td>
            </tr>`;
        }
        var tbody = document.querySelector('tbody');
        tbody.innerHTML = htmlStr;

        //render pagenum button
        var pagesum = Math.ceil(userlist.length / pagesize);
        var str = '';
        for (var i = 1; i <= pagesum; i++) {
            str += ` <li>${i}</li>`;
        }
        var ul = document.querySelector('.pagination ul');
        ul.innerHTML = str;

        //control pagenum button's color
        var lis = document.querySelectorAll('.pagination ul li');
        lis.forEach(item => item.className = '');
        lis.forEach((item, index) => {
            if (index === pagenum - 1) {
                item.className = 'active';
            }
        });
    }
}