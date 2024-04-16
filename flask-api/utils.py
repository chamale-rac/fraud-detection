from datetime import datetime


def propChecker(fields: dict, data: dict):
    for key, value in fields.items():
        expected_type, description, required = value
        if key not in data.keys():
            if required:
                return False, f"Missing required key: {key}, which is the {description}"
        else:
            if not isinstance(data[key], expected_type):
                # Special case for float and int
                if expected_type is float and isinstance(data[key], int):
                    data[key] = float(data[key])
                else:
                    return False, f"Incorrect type for key {key} ({description}): Expected {expected_type.__name__}, got {type(data[key]).__name__}"
    return True, "All properties are valid"


def propFilter(fields: dict, filter: list):
    return {k: v for k, v in fields.items() if k in filter}


def dict2Cypher(properties: dict):
    cypher_properties = []
    for k, v in properties.items():
        if isinstance(v, str):
            cypher_properties.append(f"{k}: '{v}'")
        elif isinstance(v, (int, float, bool)):
            cypher_properties.append(f"{k}: {v}")
        elif isinstance(v, list):
            cypher_properties.append(f"{k}: {v}")
        elif isinstance(v, dict):
            cypher_properties.append(f"{k}: {dict2Cypher(v)}")
        elif isinstance(v, datetime):
            casted = v.strftime("%Y-%m-%dT%H:%M:%S.%f%z")
            cypher_properties.append(f"{k}: datetime('{casted}')")
        else:
            raise ValueError(f"Unsupported value type: {type(v)}")
    return '{' + ', '.join(cypher_properties) + '}'


def node2Dict(node):
    node_dict = {prop: node[prop] for prop in node.keys()}
    node_dict['labels'] = list(node.labels)
    return node_dict


def convertDate(data_string):
    '''
    data_string example: "2024-04-12", "%Y-%m-%d"
    '''
    try:
        return datetime.datetime.strptime(data_string, "%Y-%m-%d")
    except ValueError:
        return None
