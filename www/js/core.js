var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 値を<code>ko.observable</code>化して返します。
 * <p>
 * 値が既に<code>ko.observable</code>であれば、それを返します。
 * </p>
 * @param value 値
 * @return <code>ko.observable</code>な値
 */
function observable(value) {
    if (ko.isObservable(value)) {
        return value;
    }
    return ko.observable(value);
}
/**
 * 値を<code>ko.observableArray</code>化して返します。
 * <p>
 * 値が既に<code>ko.observableArray</code>であれば、それを返します。
 * </p>
 * @param array 配列
 * @return <code>ko.observableArray</code>な値
 */
function observableArray(array) {
    if (!Array.isArray(array)) {
        throw new Error('An argument is not Array.');
    }
    if (ko.isObservable(array)) {
        return array;
    }
    return ko.observableArray(array);
}
/**
 * すべてのモデルが共通に継承すべきモデルです。
 */
var BaseModel = /** @class */ (function () {
    /**
     * オブジェクトIDを引数にとるコンストラクタです。
     * @param id オブジェクトID
     */
    function BaseModel(id) {
        this._id = observable(id || '');
    }
    Object.defineProperty(BaseModel.prototype, "id", {
        /**
         * オブジェクトIDを返します。
         * @return オブジェクトID
         */
        get: function () {
            return this._id;
        },
        /**
         * オブジェクトIDを設定します。
         * @param value オブジェクトID
         */
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseModel;
}());
;
/**
 * 部署モデルのリストを扱うモデルです。
 */
var DepartmentListModel = /** @class */ (function (_super) {
    __extends(DepartmentListModel, _super);
    /**
     * コンストラクタです。
     * @param id 当モデルのID
     * @param departmentModelList 部署モデルのリスト
     */
    function DepartmentListModel(id, departmentModelList) {
        var _this = _super.call(this, id) || this;
        _this._departmentModelList = observableArray(departmentModelList || []);
        return _this;
    }
    Object.defineProperty(DepartmentListModel.prototype, "departmentModelList", {
        /**
         * 部署モデルのリストを返します。
         * @return 部署モデルのリスト
         */
        get: function () {
            return this._departmentModelList;
        },
        /**
         * 部署モデルのリストを設定します。
         * @param value 部署モデルのリスト
         */
        set: function (value) {
            this._departmentModelList = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 引数を条件に社員モデルを検索します。
     * <ul>
     *  <li>引数の値が設定されている場合、その値をAND条件として、検索条件に追加します。</li>
     *  <li>引数の値が<code>null</code>の場合、その値を検索条件に追加しません。</li>
     * </ul>
     *
     * @param employeeId 社員ID
     * @param employeeName 社員名
     * @param departmentId 部署ID
     * @return 社員モデルのリスト。検索結果が0件の場合、空の配列を返します。
     */
    DepartmentListModel.prototype.findEmployeeByArgs = function (employeeId, employeeName, departmentId) {
        var resultList = [];
        var departmentModelList = this.departmentModelList();
        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];
            var employeeListModel = departmentModel.employeeListModel();
            var employeeModelList = employeeListModel.employeeModelList();
            for (var j = 0; j < employeeModelList.length; j++) {
                var employeeModel = employeeModelList[j];
                if (employeeId && employeeId !== employeeModel.id()) {
                    continue;
                }
                if (employeeName && employeeModel.name().indexOf(employeeName) < 0) {
                    continue;
                }
                if (departmentId && departmentId !== employeeModel.departmentModel().id()) {
                    continue;
                }
                // 返却する結果リストに追加
                resultList.push(employeeModel);
            }
        }
        return resultList;
    };
    /**
     * 部署IDを条件に部署モデルを検索します。
     * @param departmentId 部署ID
     * @return 部署モデル。検索結果が0件の場合、<code>null</code>を返します。
     */
    DepartmentListModel.prototype.findDepartmentById = function (departmentId) {
        var departmentModelList = this.departmentModelList();
        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];
            if (departmentId === departmentModel.id()) {
                return departmentModel;
            }
        }
        return null;
    };
    return DepartmentListModel;
}(BaseModel));
/**
 * 部署モデルです。
 */
var DepartmentModel = /** @class */ (function (_super) {
    __extends(DepartmentModel, _super);
    /**
     * コンストラクタです。
     * @param id 部署のID
     * @param name 部署名
     * @param employeeListModel 社員リストモデル
     */
    function DepartmentModel(id, name, employeeListModel) {
        var _this = _super.call(this, id) || this;
        _this._name = observable(name || '');
        _this._employeeListModel = observable(employeeListModel || null);
        return _this;
    }
    Object.defineProperty(DepartmentModel.prototype, "name", {
        /**
         * 部署名を返します。
         * @return 部署名
         */
        get: function () {
            return this._name;
        },
        /**
         * 部署名を設定します。
         * @param value 部署名
         */
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DepartmentModel.prototype, "employeeListModel", {
        /**
         * 社員リストモデルを返します。
         * @return 社員リストモデル
         */
        get: function () {
            return this._employeeListModel;
        },
        /**
         * 社員リストモデルを設定します。
         * @param value 社員リストモデル
         */
        set: function (value) {
            this._employeeListModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 当部署に社員を追加します。
     * @param employeeId 社員ID
     * @param employeeName 社員名
     */
    DepartmentModel.prototype.addEmployee = function (employeeId, employeeName) {
        var employeeModel = new EmployeeModel(employeeId, employeeName, this);
        this.employeeListModel().employeeModelList.push(employeeModel);
    };
    /**
     * 当部署から社員を削除します。
     * @param employeeId 社員ID
     */
    DepartmentModel.prototype.deleteEmployee = function (employeeId) {
        var employeeModelList = this.employeeListModel().employeeModelList();
        for (var i = 0; i < employeeModelList.length; i++) {
            var employeeModel = employeeModelList[i];
            if (employeeModel.id() === employeeId) {
                // 社員削除
                this.employeeListModel().employeeModelList.splice(i, 1);
            }
        }
    };
    return DepartmentModel;
}(BaseModel));
/**
 * 社員モデルのリストを扱うモデルです。
 */
var EmployeeListModel = /** @class */ (function (_super) {
    __extends(EmployeeListModel, _super);
    /**
     * コンストラクタです。
     * @param id 社員リストモデルID
     * @param employeeModelList 社員モデルリスト
     */
    function EmployeeListModel(id, employeeModelList) {
        var _this = _super.call(this, id) || this;
        _this._employeeModelList = observableArray(employeeModelList || []);
        return _this;
    }
    Object.defineProperty(EmployeeListModel.prototype, "employeeModelList", {
        /**
         * 社員モデルリストを返します。
         * @return 社員モデルリスト
         */
        get: function () {
            return this._employeeModelList;
        },
        /**
         * 社員モデルリストを設定します。
         * @param value 社員モデルリスト
         */
        set: function (value) {
            this._employeeModelList = value;
        },
        enumerable: true,
        configurable: true
    });
    return EmployeeListModel;
}(BaseModel));
/**
 * 社員モデルです。
 */
var EmployeeModel = /** @class */ (function (_super) {
    __extends(EmployeeModel, _super);
    /**
     * コンストラクタです。
     * @param id - 社員ID
     * @param name - 社員名
     * @param departmentModel - 所属部署のモデル
     */
    function EmployeeModel(id, name, departmentModel) {
        var _this = _super.call(this, id) || this;
        _this._name = observable(name || '');
        _this._departmentModel = observable(departmentModel || null);
        return _this;
    }
    Object.defineProperty(EmployeeModel.prototype, "name", {
        /**
         * 社員名を返します。
         * @return 社員名
         */
        get: function () {
            return this._name;
        },
        /**
         * 社員名を設定します。
         * @param value 社員名
         */
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeModel.prototype, "departmentModel", {
        /**
         * 所属部署を返します。
         * @return 所属部署
         */
        get: function () {
            return this._departmentModel;
        },
        /**
         * 所属部署を設定します。
         * @param value 所属部署
         */
        set: function (value) {
            this._departmentModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 社員情報を更新します。
     * @param name 社員名
     * @param departmentModel 新しく所属する部署モデル
     */
    EmployeeModel.prototype.updateEmployeeInfo = function (name, departmentModel) {
        this.name(name);
        if (this.departmentModel().id() !== departmentModel.id()) {
            var employeeModelList = this.departmentModel().employeeListModel().employeeModelList;
            for (var i = 0; i < employeeModelList().length; i++) {
                var employeeModel = employeeModelList()[i];
                if (employeeModel.id() === this.id()) {
                    // 元の部署から社員を削除
                    employeeModelList().splice(i, 1);
                    break;
                }
            }
            // 新規部署に社員を追加
            departmentModel.employeeListModel().employeeModelList.push(this);
            // 社員の部署を新規に更新
            this.departmentModel(departmentModel);
        }
    };
    return EmployeeModel;
}(BaseModel));
;
/**
 * 部署モデルのリポジトリです。
 */
var DepartmentRepository = /** @class */ (function () {
    function DepartmentRepository() {
    }
    /**
     * すべての部署モデルを返します。
     * <p>
     * すべての部署モデル(<code>DepartmentListModel</code>)は、コールバック関数の引数として返します。
     * </p>
     * @param callback コールバック関数
     */
    DepartmentRepository.findDepartmentAll = function (callback) {
        var departmentListModel = null;
        var item = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (item === null) {
            departmentListModel = this.createDepartmentListModelFromDefault();
        }
        else {
            departmentListModel = this.createDepartmentListModelFromXml(item);
        }
        // サーバーへのAjax通信を想定してコールバック
        callback(departmentListModel);
    };
    /**
     * すべての部署モデルを保存します。
     * <p>現在、ローカルストレージに保存しています。</p>
     * <p>保存完了は、コールバック関数を呼び出すことにより通知します。</p>
     * @param departmentListModel 部署リストモデル
     * @param callback コールバック関数
     */
    DepartmentRepository.saveDepartmentAll = function (departmentListModel, callback) {
        var xml = this.createDepartmentListModelXml(departmentListModel);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, xml);
        // サーバーへのAjax通信を想定してコールバック
        callback();
    };
    /**
     * 部署リストモデルのXMLデータを生成します。
     * @param departmentListModel 部署リストモデル
     * @return 部署リストモデルのXMLデータ
     */
    DepartmentRepository.createDepartmentListModelXml = function (departmentListModel) {
        var xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '    <departmentListModel>';
        xml += '        <id>' + departmentListModel.id() + '</id>';
        var departmentModelList = departmentListModel.departmentModelList();
        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];
            xml += '    <departmentModel>';
            xml += '        <id>' + departmentModel.id() + '</id>';
            xml += '        <name>' + departmentModel.name() + '</name>';
            xml += '        <employeeListModel>';
            var employeeListModel = departmentModel.employeeListModel();
            xml += '            <id>' + employeeListModel.id() + '</id>';
            var employeeModelList = employeeListModel.employeeModelList();
            for (var j = 0; j < employeeModelList.length; j++) {
                var employeeModel = employeeModelList[j];
                xml += '        <employeeModel>';
                xml += '            <id>' + employeeModel.id() + '</id>';
                xml += '            <name>' + employeeModel.name() + '</name>';
                xml += '        </employeeModel>';
            }
            xml += '        </employeeListModel>';
            xml += '    </departmentModel>';
        }
        xml += '    </departmentListModel>';
        return xml;
    };
    /**
     * 部署リストモデルをデフォルト値から生成します。
     * @return 部署モデルリスト
     */
    DepartmentRepository.createDepartmentListModelFromDefault = function () {
        var empInDev = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInSales = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInGeneral = new EmployeeListModel(GuidUtil.createGuid(), []);
        var devDeptModel = new DepartmentModel(GuidUtil.createGuid(), '開発部', empInDev);
        var salesDeptModel = new DepartmentModel(GuidUtil.createGuid(), '営業部', empInSales);
        var generalDeptModel = new DepartmentModel(GuidUtil.createGuid(), '総務部', empInGeneral);
        var departmentModelList = [];
        departmentModelList.push(devDeptModel);
        departmentModelList.push(salesDeptModel);
        departmentModelList.push(generalDeptModel);
        var departmentListModel = new DepartmentListModel(GuidUtil.createGuid(), departmentModelList);
        return departmentListModel;
    };
    /**
     * 部署リストモデルをXMLから生成します。
     * @param xml XML
     * @return 部署リストモデル
     */
    DepartmentRepository.createDepartmentListModelFromXml = function (xml) {
        var $xml = $($.parseXML(xml));
        var $departmentListModelXml = $xml.find('departmentListModel');
        var departmentListModelId = $departmentListModelXml.children('id').text();
        // 部署リストモデル
        var departmentListModel = new DepartmentListModel(departmentListModelId, []);
        var $departmentModelXml = $departmentListModelXml.find('departmentModel');
        $departmentModelXml.each(function () {
            var $deptXml = $(this);
            var departmentId = $deptXml.children('id').text();
            var departmentName = $deptXml.children('name').text();
            var $employeeListModelXml = $deptXml.find('employeeListModel');
            var employeeListModelId = $employeeListModelXml.children('id').text();
            // 部署モデル
            var departmentModel = new DepartmentModel(departmentId, departmentName, new EmployeeListModel(employeeListModelId, []));
            // 部署リストに部署を追加
            departmentListModel.departmentModelList.push(departmentModel);
            var $employeeModelXml = $employeeListModelXml.find('employeeModel');
            $employeeModelXml.each(function () {
                var $empXml = $(this);
                var employeeId = $empXml.children('id').text();
                var employeeName = $empXml.children('name').text();
                // 部署に社員を追加
                departmentModel.addEmployee(employeeId, employeeName);
            });
        });
        return departmentListModel;
    };
    /**
     * ローカルストレージキーです。
     */
    DepartmentRepository.LOCAL_STORAGE_KEY = 'sample.all-department-model';
    return DepartmentRepository;
}());
/**
 * GUIDのユーティリティです。
 */
var GuidUtil = /** @class */ (function () {
    function GuidUtil() {
    }
    /**
     * GUIDを生成します。
     * @param GUID
     */
    GuidUtil.createGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    return GuidUtil;
}());

//# sourceMappingURL=core.js.map
