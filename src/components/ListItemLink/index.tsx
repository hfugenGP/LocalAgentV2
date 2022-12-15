import { ListItem, ListItemIcon, SxProps } from '@mui/material'
import React, { useMemo, forwardRef, ReactElement } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'

interface ListItemLinkProps {
  to: string
  primary: string
  icon: ReactElement
  sx?: SxProps
}

const ListItemLink: React.FC<ListItemLinkProps> = (props) => {
  const { icon, primary, to, sx } = props
  const renderLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(
        (itemProps, ref) => {
          return (
            <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
          )
        },
      ),
    [to],
  )
  return (
    <li>
      <ListItem button component={renderLink} sx={sx}>
        <ListItemIcon>{icon}</ListItemIcon>
        {primary}
      </ListItem>
    </li>
  )
}

export default ListItemLink
