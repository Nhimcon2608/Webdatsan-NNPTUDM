import React from "react";
import UserLayout from "../../layouts/user/UserLayout";
import { useTheme } from "@mui/material";

import Developing from "../../components/common/Developing";

const TransientPage = () => {
    const theme = useTheme();

    return (
        <UserLayout>
            <Developing theme={theme} />
        </UserLayout>
    )
}

export default TransientPage;