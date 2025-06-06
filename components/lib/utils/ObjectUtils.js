export default class ObjectUtils {
    static equals(obj1, obj2, field) {
        if (field && obj1 && typeof obj1 === 'object' && obj2 && typeof obj2 === 'object') {
            return this.deepEquals(this.resolveFieldData(obj1, field), this.resolveFieldData(obj2, field));
        }

        return this.deepEquals(obj1, obj2);
    }

    /**
     * Compares two JSON objects for deep equality recursively comparing both objects.
     * @param {*} a the first JSON object
     * @param {*} b the second JSON object
     * @returns true if equals, false it not
     */
    static deepEquals(a, b) {
        if (a === b) {
            return true;
        }

        if (a && b && typeof a === 'object' && typeof b === 'object') {
            let arrA = Array.isArray(a);
            let arrB = Array.isArray(b);
            let i;
            let length;
            let key;

            if (arrA && arrB) {
                length = a.length;

                if (length !== b.length) {
                    return false;
                }

                for (i = length; i-- !== 0; ) {
                    if (!this.deepEquals(a[i], b[i])) {
                        return false;
                    }
                }

                return true;
            }

            if (arrA !== arrB) {
                return false;
            }

            let dateA = a instanceof Date;
            let dateB = b instanceof Date;

            if (dateA !== dateB) {
                return false;
            }

            if (dateA && dateB) {
                return a.getTime() === b.getTime();
            }

            let regexpA = a instanceof RegExp;
            let regexpB = b instanceof RegExp;

            if (regexpA !== regexpB) {
                return false;
            }

            if (regexpA && regexpB) {
                return a.toString() === b.toString();
            }

            let keys = Object.keys(a);

            length = keys.length;

            if (length !== Object.keys(b).length) {
                return false;
            }

            for (i = length; i-- !== 0; ) {
                if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
                    return false;
                }
            }

            for (i = length; i-- !== 0; ) {
                key = keys[i];

                if (!this.deepEquals(a[key], b[key])) {
                    return false;
                }
            }

            return true;
        }

        /*eslint no-self-compare: "off"*/
        return a !== a && b !== b;
    }

    static resolveFieldData(data, field) {
        if (!data || !field) {
            // short circuit if there is nothing to resolve
            return null;
        }

        try {
            const value = data[field];

            if (this.isNotEmpty(value)) {
                return value;
            }
        } catch {
            // Performance optimization: https://github.com/primefaces/primereact/issues/4797
            // do nothing and continue to other methods to resolve field data
        }

        if (Object.keys(data).length) {
            if (this.isFunction(field)) {
                return field(data);
            } else if (this.isNotEmpty(data[field])) {
                return data[field];
            } else if (field.indexOf('.') === -1) {
                return data[field];
            }

            let fields = field.split('.');
            let value = data;

            for (let i = 0, len = fields.length; i < len; ++i) {
                if (value == null) {
                    return null;
                }

                value = value[fields[i]];
            }

            return value;
        }

        return null;
    }

    static findDiffKeys(obj1, obj2) {
        if (!obj1 || !obj2) {
            return {};
        }

        return Object.keys(obj1)
            .filter((key) => !obj2.hasOwnProperty(key))
            .reduce((result, current) => {
                result[current] = obj1[current];

                return result;
            }, {});
    }

    /**
     * Removes keys from a JSON object that start with a string such as "data" to get all "data-id" type properties.
     *
     * @param {any} obj the JSON object to reduce
     * @param {string[]} startsWiths the string(s) to check if the property starts with this key
     * @returns the JSON object containing only the key/values that match the startsWith string
     */
    static reduceKeys(obj, startsWiths) {
        const result = {};

        if (!obj || !startsWiths || startsWiths.length === 0) {
            return result;
        }

        Object.keys(obj)
            .filter((key) => startsWiths.some((value) => key.startsWith(value)))
            .forEach(function (key) {
                result[key] = obj[key];
                delete obj[key];
            });

        return result;
    }

    static reorderArray(value, from, to) {
        if (value && from !== to) {
            if (to >= value.length) {
                to = to % value.length;
                from = from % value.length;
            }

            value.splice(to, 0, value.splice(from, 1)[0]);
        }
    }

    static findIndexInList(value, list, dataKey) {
        if (list) {
            return dataKey ? list.findIndex((item) => this.equals(item, value, dataKey)) : list.findIndex((item) => item === value);
        }

        return -1;
    }

    static getJSXElement(obj, ...params) {
        return this.isFunction(obj) ? obj(...params) : obj;
    }

    static getItemValue(obj, ...params) {
        return this.isFunction(obj) ? obj(...params) : obj;
    }

    static getProp(props, prop = '', defaultProps = {}) {
        const value = props ? props[prop] : undefined;

        return value === undefined ? defaultProps[prop] : value;
    }

    static getPropCaseInsensitive(props, prop, defaultProps = {}) {
        const fkey = this.toFlatCase(prop);

        for (let key in props) {
            if (props.hasOwnProperty(key) && this.toFlatCase(key) === fkey) {
                return props[key];
            }
        }

        for (let key in defaultProps) {
            if (defaultProps.hasOwnProperty(key) && this.toFlatCase(key) === fkey) {
                return defaultProps[key];
            }
        }

        return undefined; // Property not found
    }

    static getMergedProps(props, defaultProps) {
        return Object.assign({}, defaultProps, props);
    }

    static getDiffProps(props, defaultProps) {
        return this.findDiffKeys(props, defaultProps);
    }

    /**
     * Gets the value of a property which can be a function or a direct value.
     * If the property is a function, it will be invoked with the provided parameters.
     * @param {*} obj - The object to get the value from
     * @param {...*} params - Parameters to pass to the function if obj is a function
     * @returns {*} The resolved value
     */
    static getPropValue(obj, ...params) {
        // If obj is not a function, return it directly
        if (!this.isFunction(obj)) {
            return obj;
        }

        // Handle function invocation
        if (params.length === 1) {
            // For single parameter case, unwrap array if needed to avoid extra nesting
            const param = params[0];

            return obj(Array.isArray(param) ? param[0] : param);
        }

        // Pass all parameters to function
        return obj(...params);
    }

    static getComponentProp(component, prop = '', defaultProps = {}) {
        return this.isNotEmpty(component) ? this.getProp(component.props, prop, defaultProps) : undefined;
    }

    static getComponentProps(component, defaultProps) {
        return this.isNotEmpty(component) ? this.getMergedProps(component.props, defaultProps) : undefined;
    }

    static getComponentDiffProps(component, defaultProps) {
        return this.isNotEmpty(component) ? this.getDiffProps(component.props, defaultProps) : undefined;
    }

    static isValidChild(child, type, validTypes) {
        /* eslint-disable */
        if (child) {
            let childType = this.getComponentProp(child, '__TYPE') || (child.type ? child.type.displayName : undefined);

            // for App Router in Next.js ^14,
            if (!childType && child?.type?._payload?.value) {
                childType = child.type._payload.value.find((v) => v === type);
            }

            const isValid = childType === type;

            try {
                if (process.env.NODE_ENV !== 'production' && !isValid) {
                    if (validTypes && validTypes.includes(childType)) {
                        return false;
                    }
                    const messageTypes = validTypes ? validTypes : [type];

                    console.error(
                        `PrimeReact: Unexpected type; '${childType}'. Parent component expects a ${messageTypes.map((t) => `${t}`).join(' or ')} component or a component with the ${messageTypes
                            .map((t) => `__TYPE="${t}"`)
                            .join(' or ')} property as a child component.`
                    );
                    return false;
                }
            } catch (error) {
                // NOOP
            }

            return isValid;
        }

        return false;
        /* eslint-enable */
    }

    static getRefElement(ref) {
        if (ref) {
            return typeof ref === 'object' && ref.hasOwnProperty('current') ? ref.current : ref;
        }

        return null;
    }

    static combinedRefs(innerRef, forwardRef) {
        if (innerRef && forwardRef) {
            if (typeof forwardRef === 'function') {
                forwardRef(innerRef.current);
            } else {
                forwardRef.current = innerRef.current;
            }
        }
    }

    static removeAccents(str) {
        if (str && str.search(/[\xC0-\xFF]/g) > -1) {
            str = str
                .replace(/[\xC0-\xC5]/g, 'A')
                .replace(/[\xC6]/g, 'AE')
                .replace(/[\xC7]/g, 'C')
                .replace(/[\xC8-\xCB]/g, 'E')
                .replace(/[\xCC-\xCF]/g, 'I')
                .replace(/[\xD0]/g, 'D')
                .replace(/[\xD1]/g, 'N')
                .replace(/[\xD2-\xD6\xD8]/g, 'O')
                .replace(/[\xD9-\xDC]/g, 'U')
                .replace(/[\xDD]/g, 'Y')
                .replace(/[\xDE]/g, 'P')
                .replace(/[\xE0-\xE5]/g, 'a')
                .replace(/[\xE6]/g, 'ae')
                .replace(/[\xE7]/g, 'c')
                .replace(/[\xE8-\xEB]/g, 'e')
                .replace(/[\xEC-\xEF]/g, 'i')
                .replace(/[\xF1]/g, 'n')
                .replace(/[\xF2-\xF6\xF8]/g, 'o')
                .replace(/[\xF9-\xFC]/g, 'u')
                .replace(/[\xFE]/g, 'p')
                .replace(/[\xFD\xFF]/g, 'y');
        }

        return str;
    }

    static toFlatCase(str) {
        // convert snake, kebab, camel and pascal cases to flat case
        return this.isNotEmpty(str) && this.isString(str) ? str.replace(/(-|_)/g, '').toLowerCase() : str;
    }

    static toCapitalCase(str) {
        return this.isNotEmpty(str) && this.isString(str) ? str[0].toUpperCase() + str.slice(1) : str;
    }

    static trim(value) {
        // trim only if the value is actually a string
        return this.isNotEmpty(value) && this.isString(value) ? value.trim() : value;
    }

    static isEmpty(value) {
        return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0) || (!(value instanceof Date) && typeof value === 'object' && Object.keys(value).length === 0);
    }

    static isNotEmpty(value) {
        return !this.isEmpty(value);
    }

    static isFunction(value) {
        return !!(value && value.constructor && value.call && value.apply);
    }

    static isObject(value) {
        return value !== null && value instanceof Object && value.constructor === Object;
    }

    static isDate(value) {
        return value !== null && value instanceof Date && value.constructor === Date;
    }

    static isArray(value) {
        return value !== null && Array.isArray(value);
    }

    static isString(value) {
        return value !== null && typeof value === 'string';
    }

    static isPrintableCharacter(char = '') {
        return this.isNotEmpty(char) && char.length === 1 && char.match(/\S| /);
    }

    static isLetter(char) {
        return /^[a-zA-Z\u00C0-\u017F]$/.test(char);
    }

    static isScalar(value) {
        return value != null && (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint' || typeof value === 'boolean');
    }

    /**
     * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
     * https://caniuse.com/mdn-javascript_builtins_array_findlast
     */
    static findLast(arr, callback) {
        let item;

        if (this.isNotEmpty(arr)) {
            try {
                item = arr.findLast(callback);
            } catch {
                item = [...arr].reverse().find(callback);
            }
        }

        return item;
    }

    /**
     * Firefox-v103 does not currently support the "findLastIndex" method. It is stated that this method will be supported with Firefox-v104.
     * https://caniuse.com/mdn-javascript_builtins_array_findlastindex
     */
    static findLastIndex(arr, callback) {
        let index = -1;

        if (this.isNotEmpty(arr)) {
            try {
                index = arr.findLastIndex(callback);
            } catch {
                index = arr.lastIndexOf([...arr].reverse().find(callback));
            }
        }

        return index;
    }

    static sort(value1, value2, order = 1, comparator, nullSortOrder = 1) {
        const result = this.compare(value1, value2, comparator, order);
        let finalSortOrder = order;

        // nullSortOrder == 1 means Excel like sort nulls at bottom
        if (this.isEmpty(value1) || this.isEmpty(value2)) {
            finalSortOrder = nullSortOrder === 1 ? order : nullSortOrder;
        }

        return finalSortOrder * result;
    }

    static compare(value1, value2, comparator, order = 1) {
        let result = -1;
        const emptyValue1 = this.isEmpty(value1);
        const emptyValue2 = this.isEmpty(value2);

        if (emptyValue1 && emptyValue2) {
            result = 0;
        } else if (emptyValue1) {
            result = order;
        } else if (emptyValue2) {
            result = -order;
        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
            result = comparator(value1, value2);
        } else {
            result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        }

        return result;
    }

    static localeComparator(locale) {
        //performance gain using Int.Collator. It is not recommended to use localeCompare against large arrays.
        return new Intl.Collator(locale, { numeric: true }).compare;
    }

    static findChildrenByKey(data, key) {
        for (const item of data) {
            if (item.key === key) {
                return item.children || [];
            } else if (item.children) {
                const result = this.findChildrenByKey(item.children, key);

                if (result.length > 0) {
                    return result;
                }
            }
        }

        return [];
    }

    /**
     * This function takes mutates and object with a new value given
     * a specific field. This will handle deeply nested fields that
     * need to be modified or created.
     *
     * e.g:
     * data = {
     *  nested: {
     *      foo: "bar"
     *  }
     * }
     *
     * field = "nested.foo"
     * value = "baz"
     *
     * The function will mutate data to be
     * e.g:
     * data = {
     *  nested: {
     *      foo: "baz"
     *  }
     * }
     *
     * @param {object} data the object to be modified
     * @param {string} field the field in the object to replace
     * @param {any} value the value to have replaced in the field
     */
    static mutateFieldData(data, field, value) {
        if (typeof data !== 'object' || typeof field !== 'string') {
            // short circuit if there is nothing to resolve
            return;
        }

        const fields = field.split('.');
        let obj = data;

        for (let i = 0, len = fields.length; i < len; ++i) {
            // Check if we are on the last field
            if (i + 1 - len === 0) {
                obj[fields[i]] = value;
                break;
            }

            if (!obj[fields[i]]) {
                obj[fields[i]] = {};
            }

            obj = obj[fields[i]];
        }
    }

    /**
     * This helper function takes an object and a dot-separated key path. It traverses the object based on the path,
     * returning the value at the specified depth. If any part of the path is missing or undefined, it returns undefined.
     *
     * Example:
     * const obj = { name: 'Alice', address: { city: 'Wonderland', zip: 12345 } };
     * const path = 'address.city';
     * const result = ObjectUtils.getNestedValue(obj, path);
     * console.log(result); // Output: "Wonderland"
     *
     * @param {object} obj - The object to traverse.
     * @param {string} path - The dot-separated key path.
     * @returns {*} The value at the specified depth, or undefined if any part of the path is missing or undefined.
     */
    static getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
    }

    /**
     * This function takes an object and a dot-separated key path. It traverses the object based on the path,
     * returning the value at the specified depth. If any part of the path is missing or undefined, it returns undefined.
     *
     * Example:
     * const objA = { name: 'Alice', address: { city: 'Wonderland', zip: 12345 } };
     * const objB = { name: 'Alice', address: { city: 'Wonderland', zip: 12345 } };
     * const result = ObjectUtils.absoluteCompare(objA, objB);
     * console.log(result); // Output: true
     *
     * const objC = { name: 'Alice', address: { city: 'Wonderland', zip: 12346 } };
     * const result2 = ObjectUtils.absoluteCompare(objA, objC);
     * console.log(result2); // Output: false
     *
     * @param {object} objA - The first object to compare.
     * @param {object} objB - The second object to compare.
     * @param {number} [maxDepth=1] - The maximum depth to compare.
     * @param {number} [currentDepth=0] - The current depth (used internally for recursion).
     * @returns {boolean} True if the objects are equal within the specified depth, false otherwise.
     *
     */
    static absoluteCompare(objA, objB, maxDepth = 1, currentDepth = 0) {
        if (!objA || !objB) return true;
        if (currentDepth > maxDepth) return true;

        if (typeof objA !== typeof objB) return false;

        const aKeys = Object.keys(objA);
        const bKeys = Object.keys(objB);

        if (aKeys.length !== bKeys.length) return false;

        for (const key of aKeys) {
            const aValue = objA[key];
            const bValue = objB[key];

            // Skip comparison if values are objects
            const isObject = ObjectUtils.isObject(aValue) && ObjectUtils.isObject(bValue);
            const isFunction = ObjectUtils.isFunction(aValue) && ObjectUtils.isFunction(bValue);

            if ((isObject || isFunction) && !this.absoluteCompare(aValue, bValue, maxDepth, currentDepth + 1)) return false;
            if (!isObject && aValue !== bValue) return false;
        }

        return true;
    }

    /**
     * This helper function takes two objects and a list of keys to compare. It compares the values of the specified keys
     * in both objects. If any comparison fails, it returns false. If all specified properties are equal, it returns true.
     * It performs a shallow comparison using absoluteCompare if no keys are provided.
     *
     * Example:
     * const objA = { name: 'Alice', address: { city: 'Wonderland', zip: 12345 } };
     * const objB = { name: 'Alice', address: { city: 'Wonderland', zip: 12345 } };
     * const keysToCompare = ['name', 'address.city', 'address.zip'];
     * const result = ObjectUtils.selectiveCompare(objA, objB, keysToCompare);
     * console.log(result); // Output: true
     *
     * const objC = { name: 'Alice', address: { city: 'Wonderland', zip: 12346 } };
     * const result2 = ObjectUtils.selectiveCompare(objA, objC, keysToCompare);
     * console.log(result2); // Output: false
     *
     * @param {object} a - The first object to compare.
     * @param {object} b - The second object to compare.
     * @param {string[]} [keysToCompare] - The keys to compare. If not provided, performs a shallow comparison using absoluteCompare.
     * @param {number} [maxDepth=1] - The maximum depth to compare if the variables are objects.
     * @returns {boolean} True if all specified properties are equal, false otherwise.
     */
    static selectiveCompare(a, b, keysToCompare, maxDepth = 1) {
        if (a === b) return true;
        if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
        if (!keysToCompare) return this.absoluteCompare(a, b, 1); // If no keys are provided, the comparison is limited to one depth level.

        for (const key of keysToCompare) {
            const aValue = this.getNestedValue(a, key);
            const bValue = this.getNestedValue(b, key);

            const isObject = typeof aValue === 'object' && aValue !== null && typeof bValue === 'object' && bValue !== null;

            // If the current key is an object, they are compared in one further level only.
            if (isObject && !this.absoluteCompare(aValue, bValue, maxDepth)) return false;
            if (!isObject && aValue !== bValue) return false;
        }

        return true;
    }
}
