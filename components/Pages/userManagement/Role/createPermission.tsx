import { Button } from "@/components/ui/button";
import {
  useGetSingleUserRolePermissionQuery,
  useUserAssignPermissionMutation,
} from "@/store/features/SecurityManagement/CreateRole";
import { useGetAllUserspERMISSIONQuery } from "@/store/features/UserManagement/Roll";
import { closeFormToggle } from "@/store/zustand/formSetting";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const ModulePermissions = () => {
  const router = useRouter();
  const pathname = window.location.pathname;
  const pathSegments = pathname.split("/").filter((segment) => segment);
  const roleId = pathSegments[4];

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [updateClicked, setUpdateClicked] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const {
    data: rolePermissionList,
    isLoading: rolePermissionLoading,
    isError: rolePermissionError,
  } = useGetAllUserspERMISSIONQuery();
  const { data: checkedRolePermissionList } =
    useGetSingleUserRolePermissionQuery({ id: roleId }, { skip: !roleId });
  const [assignPermission] = useUserAssignPermissionMutation();

  useEffect(() => {
    if (rolePermissionList?.data) {
      const permissionNodes = rolePermissionList.data.flatMap(
        (role: any) =>
          role.module?.map((module: any) => ({
            value: module.name,
            label: module.name,
            children: [
              ...(Array.isArray(module.sub_module)
                ? module.sub_module.flatMap((subModule: any) => ({
                    value: subModule.name,
                    label: subModule.name,
                    children: Array.isArray(subModule.permission)
                      ? subModule.permission.map((perm: any) => ({
                          value: perm.name,
                          label: perm.name,
                        }))
                      : [],
                  }))
                : []),
              ...(Array.isArray(module.permission)
                ? module.permission.map((perm: any) => ({
                    value: perm.name,
                    label: perm.name,
                  }))
                : []),
            ],
          })) || []
      );
      setModules(permissionNodes);
    }
  }, [rolePermissionList]);

  useEffect(() => {
    if (checkedRolePermissionList?.data) {
      const permissions: string[] = checkedRolePermissionList.data.flatMap(
        (role: any) =>
          role.module?.flatMap((module: any) => [
            ...(Array.isArray(module.sub_module)
              ? module.sub_module.flatMap((subModule: any) =>
                  Array.isArray(subModule.permission)
                    ? subModule.permission.map((perm: any) => perm.name)
                    : []
                )
              : []),
            ...(Array.isArray(module.permission)
              ? module.permission.map((perm: any) => perm.name)
              : []),
          ]) || []
      );
      setCheckedPermissions(permissions);
    }
  }, [checkedRolePermissionList]);

  useEffect(() => {
    if (updateClicked) {
      const allCheckedValues = checkedPermissions; // Adjust this based on your needs
      assignPermission({ id: roleId, permission_id: allCheckedValues })
        .unwrap()
        .then((res) => {
          if (res.code === 200) {
            closeFormToggle();
            Swal.fire({
              title: "Success!",
              text: "Role Permission Updated Successfully",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#0b9e45",
            }).then(() => {
              router.push("/admin/user-management/role");
            });
          }
        })
        .catch((err) => {});
      setUpdateClicked(false);
    }
  }, [updateClicked]);

  const handleModuleCheck = (moduleId: string, isChecked: boolean) => {
    const module = modules.find((mod) => mod.value === moduleId);
    if (module) {
      const newCheckedPermissions = isChecked
        ? [
            ...checkedPermissions,
            ...module.children.flatMap((child: any) =>
              child.children
                ? child.children.map((subChild: any) => subChild.value)
                : [child.value]
            ),
          ]
        : checkedPermissions.filter(
            (perm) =>
              !module.children
                .flatMap((child: any) =>
                  child.children
                    ? child.children.map((subChild: any) => subChild.value)
                    : [child.value]
                )
                .includes(perm)
          );
      setCheckedPermissions(newCheckedPermissions);
    }
  };

  const handlePermissionCheck = (permission: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedPermissions((prev) => [...prev, permission]);
    } else {
      setCheckedPermissions((prev) =>
        prev.filter((perm) => perm !== permission)
      );
    }
  };

  const isModuleChecked = (moduleId: string) => {
    const module = modules.find((mod) => mod.value === moduleId);
    if (module) {
      const allChildren = module.children.flatMap((child: any) =>
        child.children
          ? child.children.map((subChild: any) => subChild.value)
          : [child.value]
      );
      const allChecked = allChildren.every((childValue: any) =>
        checkedPermissions.includes(childValue)
      );
      const someChecked = allChildren.some((childValue: any) =>
        checkedPermissions.includes(childValue)
      );
      return someChecked ? (allChecked ? true : "partial") : false;
    }
    return false;
  };

  const isPermissionChecked = (permission: string) => {
    return checkedPermissions.includes(permission);
  };

  const handleToggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newExpandedModules = new Set(prev);
      if (newExpandedModules.has(moduleId)) {
        newExpandedModules.delete(moduleId);
      } else {
        newExpandedModules.add(moduleId);
      }
      return newExpandedModules;
    });
  };

  // Ref to access input elements
  const checkboxRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    Object.keys(checkboxRefs.current).forEach((moduleId) => {
      const checkbox = checkboxRefs.current[moduleId];
      if (checkbox) {
        checkbox.indeterminate = isModuleChecked(moduleId) === "partial";
      }
    });
  }, [modules, checkedPermissions]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="bg-white p-4 rounded shadow-lg">
        {modules.map((module) => (
          <div
            key={module.value}
            className="mb-4 rounded-lg bg-gray-200 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center text-lg font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isModuleChecked(module.value) === true}
                  ref={(el: any) => (checkboxRefs.current[module.value] = el)}
                  onChange={(e) =>
                    handleModuleCheck(module.value, e.target.checked)
                  }
                />
                {/* {module.label} */}
                {module.label.split("_").map((part: any, index: any) => (
                  <span key={index} className="mr-1">
                    {part}
                  </span>
                ))}
              </label>

              <button
                onClick={() => handleToggleModule(module.value)}
                className="flex items-center"
              >
                {expandedModules.has(module.value) ? (
                  <ChevronDown className="ml-1" />
                ) : (
                  <ChevronRight className="ml-1" />
                )}
              </button>
            </div>

            {expandedModules.has(module.value) && (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 bg-gray-100 p-4 rounded-lg">
                {module.children.map((child: any) =>
                  child.children ? (
                    child.children.map((subChild: any) => (
                      <label
                        key={subChild.value}
                        className="flex items-center bg-gray-300 p-2 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={isPermissionChecked(subChild.value)}
                          onChange={(e) =>
                            handlePermissionCheck(
                              subChild.value,
                              e.target.checked
                            )
                          }
                        />
                        <span className="text-wrap text-xs lg:text-md">
                          {/* {subChild.label} */}
                          {subChild.label
                            .split("_")
                            .map((partChild: any, index: any) => (
                              <span key={index} className="mr-1">
                                {partChild}
                              </span>
                            ))}
                        </span>
                      </label>
                    ))
                  ) : (
                    <label
                      key={child.value}
                      className="flex items-center bg-gray-300 p-2 rounded-lg cursor-pointer text-wrap"
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={isPermissionChecked(child.value)}
                        onChange={(e) =>
                          handlePermissionCheck(child.value, e.target.checked)
                        }
                      />
                      {child.label}
                    </label>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <Link
        href={`/admin/user-management/role`}
      >
        <Button
          className="bg-red-600 hover:bg-red-600 xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5 mt-4 mr-5"
        >
          Cancle
        </Button>
      </Link>

      <Button
        onClick={() => setUpdateClicked(true)}
        className="bg-warning hover:bg-warning xl:px-8 xl:py-5 lg:px-8 lg:py-4 md:px-6 md:py-4 sm:px-7 sm:py-5 mt-4"
      >
        Update
      </Button>
    </div>
  );
};

export default ModulePermissions;
